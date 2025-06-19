
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Trophy, Star, Edit, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const UserProfile = () => {
  const { profile, updateProfile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || ''
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    
    try {
      const { error } = await updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim() || null
      });

      if (error) {
        console.error('Profile update error:', error);
        toast({
          title: "Update Failed",
          description: error.message || "Failed to update profile",
          variant: "destructive"
        });
        setSaving(false);
        return;
      }

      toast({
        title: "Success!",
        description: "Profile updated successfully"
      });
      
      setEditing(false);
      await refreshProfile();
    } catch (error) {
      console.error('Profile update exception:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black/30 border-purple-500/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <User className="w-6 h-6 mr-2 text-cyan-400" />
            User Profile
          </CardTitle>
          {!editing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(true)}
              className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="border-green-500 text-green-400 hover:bg-green-500 hover:text-black"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    name: profile.name || '',
                    phone: profile.phone || ''
                  });
                }}
                disabled={saving}
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-black"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                {editing ? (
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-black/20 border-gray-600 text-white"
                    placeholder="Enter your full name"
                    disabled={saving}
                  />
                ) : (
                  <p className="text-white text-lg">{profile.name || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <p className="text-white text-lg">{profile.email}</p>
                <Badge className="mt-1 bg-green-500/20 text-green-400">Verified</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                {editing ? (
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="bg-black/20 border-gray-600 text-white"
                    placeholder="Enter your phone number"
                    disabled={saving}
                  />
                ) : (
                  <p className="text-white text-lg">{profile.phone || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Member Since
                </label>
                <p className="text-white text-lg">{formatDate(profile.created_at)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge className={`${profile.is_admin ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
              {profile.is_admin ? '👑 Admin Account' : '🎮 Player Account'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
