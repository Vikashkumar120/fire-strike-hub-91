
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CalendarIcon, Trophy, Users, IndianRupee } from 'lucide-react';

const TournamentCreation = () => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    prize: '',
    entry_fee: '',
    max_players: '',
    start_time: '',
    map: '',
    duration: '',
    custom_code: '',
    thumbnail: ''
  });
  
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.prize || !formData.entry_fee || !formData.max_players || !formData.start_time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('tournaments')
        .insert({
          title: formData.title,
          type: formData.type,
          prize: formData.prize,
          entry_fee: parseInt(formData.entry_fee),
          max_players: parseInt(formData.max_players),
          start_time: formData.start_time,
          map: formData.map || null,
          duration: formData.duration || null,
          custom_code: formData.custom_code || null,
          thumbnail: formData.thumbnail || '/lovable-uploads/aa3dfb2a-24a0-4fbb-8a63-87e451fe6311.png',
          status: 'open',
          current_players: 0
        });

      if (error) {
        console.error('Tournament creation error:', error);
        toast({
          title: "Error",
          description: "Failed to create tournament. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success!",
        description: "Tournament created successfully",
      });

      // Reset form
      setFormData({
        title: '',
        type: '',
        prize: '',
        entry_fee: '',
        max_players: '',
        start_time: '',
        map: '',
        duration: '',
        custom_code: '',
        thumbnail: ''
      });

    } catch (error) {
      console.error('Tournament creation exception:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-black/30 border-purple-500/20 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
          Create New Tournament
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Tournament Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Squad Championship"
                className="bg-black/20 border-gray-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-white">Tournament Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger className="bg-black/20 border-gray-600 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-gray-600">
                  <SelectItem value="Solo">Solo</SelectItem>
                  <SelectItem value="Duo">Duo</SelectItem>
                  <SelectItem value="Squad">Squad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prize" className="text-white">Prize Pool *</Label>
              <Input
                id="prize"
                value={formData.prize}
                onChange={(e) => handleInputChange('prize', e.target.value)}
                placeholder="e.g., ₹25,000"
                className="bg-black/20 border-gray-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="entry_fee" className="text-white">Entry Fee *</Label>
              <Input
                id="entry_fee"
                type="number"
                value={formData.entry_fee}
                onChange={(e) => handleInputChange('entry_fee', e.target.value)}
                placeholder="100"
                className="bg-black/20 border-gray-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_players" className="text-white">Max Players *</Label>
              <Input
                id="max_players"
                type="number"
                value={formData.max_players}
                onChange={(e) => handleInputChange('max_players', e.target.value)}
                placeholder="64"
                className="bg-black/20 border-gray-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_time" className="text-white">Start Time *</Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => handleInputChange('start_time', e.target.value)}
                className="bg-black/20 border-gray-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="map" className="text-white">Map</Label>
              <Input
                id="map"
                value={formData.map}
                onChange={(e) => handleInputChange('map', e.target.value)}
                placeholder="e.g., Bermuda"
                className="bg-black/20 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-white">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="e.g., 45 min"
                className="bg-black/20 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom_code" className="text-white">Custom Code</Label>
              <Input
                id="custom_code"
                value={formData.custom_code}
                onChange={(e) => handleInputChange('custom_code', e.target.value)}
                placeholder="Tournament code"
                className="bg-black/20 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail" className="text-white">Thumbnail URL</Label>
              <Input
                id="thumbnail"
                value={formData.thumbnail}
                onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                placeholder="Image URL (optional)"
                className="bg-black/20 border-gray-600 text-white"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold py-3"
          >
            {loading ? 'Creating Tournament...' : 'Create Tournament'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TournamentCreation;
