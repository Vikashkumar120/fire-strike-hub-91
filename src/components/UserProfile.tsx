
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Phone, Calendar, Shield, Edit3, Save, X } from 'lucide-react';

const UserProfile = () => {
  const { user, profile, updateProfile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    avatar_url: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        avatar_url: profile.avatar_url || ''
      });
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      refreshProfile();
    }
  }, [user, refreshProfile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim() || null,
        avatar_url: formData.avatar_url.trim() || null
      });

      if (error) {
        console.error('Profile update error:', error);
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success!",
        description: "Profile updated successfully",
      });

      setIsEditing(false);
      await refreshProfile();

    } catch (error) {
      console.error('Profile update exception:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        avatar_url: profile.avatar_url || ''
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Please login to view your profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-black/30 border-purple-500/20 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2 text-purple-400" />
              User Profile
            </div>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  size="sm"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button
                  onClick={handleCancel}
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={formData.avatar_url || profile?.avatar_url} alt={profile?.name || 'User'} />
              <AvatarFallback className="bg-purple-500/20 text-purple-300 text-lg">
                {(profile?.name || user.email || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold text-white">
                {profile?.name || 'Loading...'}
              </h3>
              <p className="text-gray-400">{user.email}</p>
              {profile?.is_admin && (
                <div className="flex items-center mt-2">
                  <Shield className="w-4 h-4 text-red-400 mr-1" />
                  <span className="text-red-400 text-sm font-medium">Administrator</span>
                </div>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-black/20 border-gray-600 text-white"
                />
              ) : (
                <div className="flex items-center p-3 bg-black/20 rounded-md border border-gray-600">
                  <User className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-white">{profile?.name || 'Not set'}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email Address</Label>
              <div className="flex items-center p-3 bg-black/10 rounded-md border border-gray-700">
                <Mail className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-gray-300">{user.email}</span>
                <span className="ml-auto text-xs text-gray-500">Cannot be changed</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  className="bg-black/20 border-gray-600 text-white"
                />
              ) : (
                <div className="flex items-center p-3 bg-black/20 rounded-md border border-gray-600">
                  <Phone className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-white">{profile?.phone || 'Not set'}</span>
                </div>
              )}
            </div>

            {isEditing && (
              <div className="space-y-2">
                <Label htmlFor="avatar_url" className="text-white">Avatar URL</Label>
                <Input
                  id="avatar_url"
                  value={formData.avatar_url}
                  onChange={(e) => handleInputChange('avatar_url', e.target.value)}
                  placeholder="Enter avatar image URL (optional)"
                  className="bg-black/20 border-gray-600 text-white"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-white">Account Created</Label>
              <div className="flex items-center p-3 bg-black/10 rounded-md border border-gray-700">
                <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-gray-300">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
