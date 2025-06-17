
import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Zap } from 'lucide-react';
import {Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { isAuthenticated, signIn, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "सभी फील्ड भरें",
        description: "कृपया ईमेल और पासवर्ड दोनों भरें",
        variant: "destructive"
      });
      return;
    }

    console.log('Login form submitted with:', { email: formData.email, password: '***' });
    setLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        console.error('Login failed:', error);
        let errorMessage = "लॉगिन में विफलता";
        
        if (error.message?.includes('Invalid login credentials')) {
          errorMessage = "गलत ईमेल या पासवर्ड";
        } else if (error.message?.includes('Email not confirmed')) {
          errorMessage = "कृपया पहले अपना ईमेल verify करें";
        }
        
        toast({
          title: "लॉगिन नहीं हो सका",
          description: errorMessage,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      console.log('Login successful, redirecting to dashboard');
      toast({
        title: "सफलता!",
        description: "आपका लॉगिन हो गया है",
      });

      // Small delay to show success message
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (error) {
      console.error('Login exception:', error);
      toast({
        title: "तकनीकी समस्या",
        description: "कुछ गलत हुआ है। कृपया दोबारा कोशिश करें",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    console.log('Google login button clicked');
    setLoading(true);
    
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        console.error('Google login failed:', error);
        toast({
          title: "Google लॉगिन नहीं हो सका",
          description: error.message || "Google के साथ लॉगिन में समस्या",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      console.log('Google login initiated successfully');
      // Google auth will redirect, so no need to set loading to false
      
    } catch (error) {
      console.error('Google login exception:', error);
      toast({
        title: "Google लॉगिन में समस्या",
        description: "Google के साथ लॉगिन में तकनीकी समस्या",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 md:w-64 h-32 md:h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 md:w-80 h-40 md:h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-white">FireTourneys</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">स्वागत है</h1>
          <p className="text-gray-300 text-sm md:text-base px-4">अपना खाता खोलने के लिए लॉगिन करें</p>
        </div>

        <Card className="bg-black/30 backdrop-blur-md border border-gray-700 mx-4 md:mx-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-center text-lg md:text-xl">लॉगिन करें</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-gray-300 text-sm font-medium">
                  ईमेल पता
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="अपना ईमेल डालें"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-10 md:pl-12 bg-black/20 border-gray-600 text-white placeholder-gray-400 h-10 md:h-12"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-gray-300 text-sm font-medium">
                  पासवर्ड
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="अपना पासवर्ड डालें"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="pl-10 md:pl-12 pr-10 md:pr-12 bg-black/20 border-gray-600 text-white placeholder-gray-400 h-10 md:h-12"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium py-2 md:py-3 h-10 md:h-12"
              >
                {loading ? 'लॉगिन हो रहा है...' : 'लॉगिन करें'}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black/30 text-gray-400">या फिर</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 h-10 md:h-12"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {loading ? 'लोड हो रहा है...' : 'Google से लॉगिन करें'}
              </Button>
            </form>

            <div className="mt-4 md:mt-6 text-center">
              <p className="text-gray-300 text-sm">
                खाता नहीं है?{' '}
                <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium">
                  साइन अप करें
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-black/20 rounded-lg text-xs text-gray-400">
            <p>Debug: Google Client ID configured</p>
            <p>Status: {loading ? 'Loading...' : 'Ready'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
