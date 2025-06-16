
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageViewerProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const ImageViewer = ({ imageUrl, isOpen, onClose, title }: ImageViewerProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative max-w-4xl max-h-[90vh] w-full">
        <div className="bg-black/30 backdrop-blur-md border border-gray-700 rounded-lg overflow-hidden">
          {title && (
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-medium">{title}</h3>
            </div>
          )}
          
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/50 backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </Button>
            
            <div className="p-4">
              <img
                src={imageUrl}
                alt={title || "Payment Screenshot"}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUM5Q0EwIiBmb250LXNpemU9IjE0Ij5JbWFnZSBub3QgZm91bmQ8L3RleHQ+Cjwvc3ZnPgo=";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
