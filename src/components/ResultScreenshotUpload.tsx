
import React, { useState } from 'react';
import { Upload, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const ResultScreenshotUpload = ({ matchId, onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadScreenshot = async () => {
    if (!selectedFile) return;

    setUploading(true);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you'd upload to your storage service
      // For demo, we'll store the base64 data
      const reader = new FileReader();
      reader.onload = (e) => {
        const screenshotData = e.target.result;
        
        // Update match history with screenshot
        const matchHistory = JSON.parse(localStorage.getItem('matchHistory') || '[]');
        const updatedHistory = matchHistory.map(match => {
          if (match.id === matchId) {
            return { ...match, resultScreenshot: screenshotData };
          }
          return match;
        });
        localStorage.setItem('matchHistory', JSON.stringify(updatedHistory));
        
        toast({
          title: "Screenshot Uploaded!",
          description: "Your result screenshot has been submitted successfully",
        });
        
        if (onUploadComplete) {
          onUploadComplete(screenshotData);
        }
        
        setUploading(false);
        setSelectedFile(null);
        setPreview(null);
      };
      reader.readAsDataURL(selectedFile);
      
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Please try again",
        variant: "destructive"
      });
      setUploading(false);
    }
  };

  return (
    <Card className="bg-black/30 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Upload className="w-5 h-5 mr-2" />
          Upload Result Screenshot
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!preview ? (
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-300 mb-2">Click to upload your match result screenshot</p>
            <p className="text-gray-500 text-sm">PNG, JPG up to 5MB</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="screenshot-upload"
            />
            <label
              htmlFor="screenshot-upload"
              className="mt-4 inline-block cursor-pointer bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all"
            >
              Select Image
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-64 object-contain rounded-lg border border-gray-600"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={uploadScreenshot}
                disabled={uploading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Screenshot'}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedFile(null);
                  setPreview(null);
                }}
                className="border-gray-600 text-gray-300"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultScreenshotUpload;
