
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Calendar, Trophy, Users, MapPin, Clock, Code, DollarSign } from 'lucide-react';

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
    thumbnail: '/lovable-uploads/aa3dfb2a-24a0-4fbb-8a63-87e451fe6311.png'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Creating tournament with data:', formData);

      // Validate required fields
      if (!formData.title || !formData.type || !formData.prize || !formData.entry_fee || 
          !formData.max_players || !formData.start_time) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      // Convert string values to appropriate types
      const tournamentData = {
        title: formData.title.trim(),
        type: formData.type,
        prize: formData.prize.trim(),
        entry_fee: parseInt(formData.entry_fee),
        max_players: parseInt(formData.max_players),
        start_time: new Date(formData.start_time).toISOString(),
        map: formData.map || null,
        duration: formData.duration || null,
        custom_code: formData.custom_code || null,
        thumbnail: formData.thumbnail,
        status: 'open',
        current_players: 0
      };

      console.log('Processed tournament data:', tournamentData);

      const { data, error } = await supabase
        .from('tournaments')
        .insert([tournamentData])
        .select()
        .single();

      if (error) {
        console.error('Tournament creation error:', error);
        throw error;
      }

      console.log('Tournament created successfully:', data);

      toast({
        title: "Tournament Created!",
        description: `${formData.title} has been created successfully`,
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
        thumbnail: '/lovable-uploads/aa3dfb2a-24a0-4fbb-8a63-87e451fe6311.png'
      });

    } catch (error: any) {
      console.error('Error creating tournament:', error);
      toast({
        title: "Error",
        description: `Failed to create tournament: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-black/30 border-purple-500/20 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Plus className="w-5 h-5 mr-2 text-purple-400" />
          Create New Tournament
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white flex items-center">
                <Trophy className="w-4 h-4 mr-2" />
                Tournament Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter tournament title"
                className="bg-black/50 border-gray-700 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-white flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Tournament Type *
              </Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger className="bg-black/50 border-gray-700 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Solo">Solo</SelectItem>
                  <SelectItem value="Duo">Duo</SelectItem>
                  <SelectItem value="Squad">Squad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prize" className="text-white flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Prize Pool *
              </Label>
              <Input
                id="prize"
                value={formData.prize}
                onChange={(e) => handleInputChange('prize', e.target.value)}
                placeholder="e.g., ₹25,000"
                className="bg-black/50 border-gray-700 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="entry_fee" className="text-white">Entry Fee (₹) *</Label>
              <Input
                id="entry_fee"
                type="number"
                value={formData.entry_fee}
                onChange={(e) => handleInputChange('entry_fee', e.target.value)}
                placeholder="100"
                className="bg-black/50 border-gray-700 text-white"
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
                className="bg-black/50 border-gray-700 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_time" className="text-white flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Start Time *
              </Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => handleInputChange('start_time', e.target.value)}
                className="bg-black/50 border-gray-700 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="map" className="text-white flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Map
              </Label>
              <Select value={formData.map} onValueChange={(value) => handleInputChange('map', value)}>
                <SelectTrigger className="bg-black/50 border-gray-700 text-white">
                  <SelectValue placeholder="Select map" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bermuda">Bermuda</SelectItem>
                  <SelectItem value="Purgatory">Purgatory</SelectItem>
                  <SelectItem value="Kalahari">Kalahari</SelectItem>
                  <SelectItem value="Alpine">Alpine</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-white flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Duration
              </Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="e.g., 45 min"
                className="bg-black/50 border-gray-700 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom_code" className="text-white flex items-center">
              <Code className="w-4 h-4 mr-2" />
              Custom Room Code
            </Label>
            <Input
              id="custom_code"
              value={formData.custom_code}
              onChange={(e) => handleInputChange('custom_code', e.target.value)}
              placeholder="Enter custom room code (optional)"
              className="bg-black/50 border-gray-700 text-white"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
          >
            {isSubmitting ? (
              <>Creating Tournament...</>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create Tournament
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TournamentCreation;
