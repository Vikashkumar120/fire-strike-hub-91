
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!error && profileData) {
        console.log('Profile fetched successfully:', profileData);
        setProfile(profileData);
      } else {
        console.log('Profile not found, creating new profile');
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            name: user?.user_metadata?.name || user?.email?.split('@')[0] || 'User',
            email: user?.email || '',
            phone: user?.user_metadata?.phone || null,
            is_admin: false
          })
          .select()
          .single();
          
        if (!createError && newProfile) {
          setProfile(newProfile);
        }
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) {
      return { error: { message: 'No user logged in' } };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Profile update error:', error);
        return { error };
      }

      setProfile(data);
      return { error: null };
    } catch (error) {
      console.error('Profile update exception:', error);
      return { error };
    }
  };

  useEffect(() => {
    console.log('Setting up auth listeners...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        
        console.log('Initial session check:', session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      console.log('Cleaning up auth listeners');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    console.log('Attempting signup for:', email);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name,
            phone
          }
        }
      });
      
      if (error) {
        console.error('Signup error:', error);
        setLoading(false);
        return { error };
      }

      console.log('Signup successful:', data);
      setLoading(false);
      return { error: null };
    } catch (error) {
      console.error('Signup exception:', error);
      setLoading(false);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('Attempting signin for:', email);
    setLoading(true);
    
    try {
      // Check for admin credentials first
      if (email === 'admin@firetourneys.com' && password === 'admin123') {
        console.log('Admin login attempt detected');
        
        // Check if admin profile exists in database
        const { data: adminProfile, error: adminError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email)
          .eq('is_admin', true)
          .maybeSingle();
          
        if (adminError) {
          console.error('Admin profile check error:', adminError);
        }
        
        if (adminProfile) {
          console.log('Admin profile found:', adminProfile);
          
          // Create a valid user object for admin
          const adminUser: User = {
            id: adminProfile.id,
            email: adminProfile.email,
            user_metadata: { name: adminProfile.name },
            app_metadata: {},
            aud: 'authenticated',
            created_at: adminProfile.created_at,
            role: 'authenticated',
            updated_at: adminProfile.updated_at || adminProfile.created_at
          };
          
          // Create a valid session for admin
          const adminSession: Session = {
            user: adminUser,
            access_token: 'admin-mock-token',
            refresh_token: 'admin-mock-refresh',
            expires_in: 3600,
            expires_at: Math.floor(Date.now() / 1000) + 3600,
            token_type: 'bearer'
          };
          
          setUser(adminUser);
          setProfile(adminProfile);
          setSession(adminSession);
          
          setLoading(false);
          console.log('Admin login successful');
          return { error: null };
        } else {
          console.log('Admin profile not found in database');
          setLoading(false);
          return { error: { message: 'Admin account not found. Please contact support.' } };
        }
      }
      
      // Regular user login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Signin error:', error);
        setLoading(false);
        return { error };
      }

      console.log('Signin successful:', data);
      setLoading(false);
      return { error: null };
    } catch (error) {
      console.error('Signin exception:', error);
      setLoading(false);
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    console.log('Attempting Google signin');
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        console.error('Google signin error:', error);
        setLoading(false);
        return { error };
      }

      console.log('Google signin initiated:', data);
      return { error: null };
    } catch (error) {
      console.error('Google signin exception:', error);
      setLoading(false);
      return { error };
    }
  };

  const signOut = async () => {
    console.log('Signing out');
    setLoading(true);
    
    try {
      // Only call supabase signOut for real users, not admin mock session
      if (user?.email !== 'admin@firetourneys.com') {
        await supabase.auth.signOut();
      }
      
      setUser(null);
      setProfile(null);
      setSession(null);
      setLoading(false);
    } catch (error) {
      console.error('Signout error:', error);
      setUser(null);
      setProfile(null);
      setSession(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile,
      session,
      loading,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      updateProfile,
      refreshProfile,
      isAuthenticated: !!user,
      isAdmin: profile?.is_admin || false
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
