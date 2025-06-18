
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Trophy, Star, Edit, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const UserProfile = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [matchStats, setMatchStats] = useState({
    totalMatches: 0,
    wins: 0,
    losses: 0,
    winRate: 0
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || ''
      });
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      loadMatchHistory();
    }
  }, [user]);

  const loadMatchHistory = () => {
    try {
      const allMatches = JSON.parse(localStorage.getItem('matchHistory') || '[]');
      const userMatches = allMatches.filter(match => match.userId === user?.id);
      
      const wins = userMatches.filter(match => match.result === 'winner').length;
      const losses = userMatches.filter(match => match.result === 'loss').length;
      const total = userMatches.length;
      const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

      setMatchStats({
        totalMatches: total,
        wins,
        losses,
        winRate
      });
    } catch (error) {
      console.error('Error loading match history:', error);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user || !profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
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
                className="border-green-500 text-green-400 hover:bg-green-500 hover:text-black"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
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
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-black"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Information */}
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

          {/* Account Type Badge */}
          <div className="flex items-center space-x-2">
            <Badge className={`${profile.is_admin ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
              {profile.is_admin ? '👑 Admin Account' : '🎮 Player Account'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Gaming Statistics */}
      <Card className="bg-black/30 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
            Gaming Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{matchStats.totalMatches}</div>
              <div className="text-gray-300 text-sm">Total Matches</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">{matchStats.wins}</div>
              <div className="text-gray-300 text-sm">Wins</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">{matchStats.losses}</div>
              <div className="text-gray-300 text-sm">Losses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">{matchStats.winRate}%</div>
              <div className="text-gray-300 text-sm">Win Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Badge */}
      {matchStats.totalMatches > 0 && (
        <Card className="bg-black/30 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-4">
              <Star className="w-8 h-8 text-yellow-400" />
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">Performance Rank</h3>
                <Badge className={`text-lg px-4 py-2 ${
                  matchStats.winRate >= 80 ? 'bg-yellow-500/20 text-yellow-400' :
                  matchStats.winRate >= 60 ? 'bg-green-500/20 text-green-400' :
                  matchStats.winRate >= 40 ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {matchStats.winRate >= 80 ? '🏆 Champion' :
                   matchStats.winRate >= 60 ? '🥇 Expert' :
                   matchStats.winRate >= 40 ? '🥈 Skilled' :
                   '🥉 Beginner'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserProfile;
