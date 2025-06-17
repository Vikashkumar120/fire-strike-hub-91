
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Upload, Image as ImageIcon } from 'lucide-react';

const TournamentCreation = () => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    prize: '',
    maxPlayers: '',
    startTime: '',
    entryFee: '',
    map: '',
    duration: '',
    description: '',
    thumbnail: ''
  });
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setThumbnailPreview(result);
        setFormData(prev => ({ ...prev, thumbnail: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.prize) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Create new tournament
    const newTournament = {
      id: Date.now(),
      ...formData,
      players: `0/${formData.maxPlayers}`,
      status: 'open',
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const existingTournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
    const updatedTournaments = [...existingTournaments, newTournament];
    localStorage.setItem('tournaments', JSON.stringify(updatedTournaments));

    toast({
      title: "Tournament Created!",
      description: `${formData.title} has been created successfully.`
    });

    // Reset form
    setFormData({
      title: '',
      type: '',
      prize: '',
      maxPlayers: '',
      startTime: '',
      entryFee: '',
      map: '',
      duration: '',
      description: '',
      thumbnail: ''
    });
    setThumbnailPreview('');
  };

  return (
    <Card className="bg-black/30 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white text-2xl">Create New Tournament</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-300">Tournament Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter tournament title"
                className="bg-black/20 border-gray-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-gray-300">Tournament Type *</Label>
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
              <Label htmlFor="prize" className="text-gray-300">Prize Pool *</Label>
              <Input
                id="prize"
                value={formData.prize}
                onChange={(e) => handleInputChange('prize', e.target.value)}
                placeholder="₹25,000"
                className="bg-black/20 border-gray-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPlayers" className="text-gray-300">Max Players</Label>
              <Input
                id="maxPlayers"
                value={formData.maxPlayers}
                onChange={(e) => handleInputChange('maxPlayers', e.target.value)}
                placeholder="64"
                type="number"
                className="bg-black/20 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="entryFee" className="text-gray-300">Entry Fee</Label>
              <Input
                id="entryFee"
                value={formData.entryFee}
                onChange={(e) => handleInputChange('entryFee', e.target.value)}
                placeholder="₹100"
                className="bg-black/20 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="map" className="text-gray-300">Map</Label>
              <Select value={formData.map} onValueChange={(value) => handleInputChange('map', value)}>
                <SelectTrigger className="bg-black/20 border-gray-600 text-white">
                  <SelectValue placeholder="Select map" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-gray-600">
                  <SelectItem value="Bermuda">Bermuda</SelectItem>
                  <SelectItem value="Purgatory">Purgatory</SelectItem>
                  <SelectItem value="Kalahari">Kalahari</SelectItem>
                  <SelectItem value="Alpine">Alpine</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-gray-300">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="45 min"
                className="bg-black/20 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-gray-300">Start Time</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className="bg-black/20 border-gray-600 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Tournament description..."
              className="bg-black/20 border-gray-600 text-white min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail" className="text-gray-300">Tournament Thumbnail</Label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
              </div>
              {thumbnailPreview && (
                <div className="relative">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-20 h-20 object-cover rounded-lg border border-gray-600"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 w-6 h-6 p-0"
                    onClick={() => {
                      setThumbnailPreview('');
                      setFormData(prev => ({ ...prev, thumbnail: '' }));
                    }}
                  >
                    ×
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
          >
            Create Tournament
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TournamentCreation;
