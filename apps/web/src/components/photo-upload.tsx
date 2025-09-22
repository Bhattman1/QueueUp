"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { photoSources, fetchPhotosFromSource, getRestaurantSearchQueries } from "../lib/photo-sources";

interface PhotoUploadProps {
  restaurantId: string;
  currentPhotos: string[];
  onPhotosUpdate: (photos: string[]) => void;
}

export function PhotoUpload({ restaurantId, currentPhotos, onPhotosUpdate }: PhotoUploadProps) {
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedSource, setSelectedSource] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [isLoadingExternal, setIsLoadingExternal] = useState(false);

  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    
    const updatedPhotos = [...currentPhotos, newPhotoUrl.trim()];
    onPhotosUpdate(updatedPhotos);
    setNewPhotoUrl("");
  };

  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = currentPhotos.filter((_, i) => i !== index);
    onPhotosUpdate(updatedPhotos);
  };

  const handleUploadFromFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // In a real app, you'd upload to a service like Cloudinary, AWS S3, etc.
      // For now, we'll create a placeholder URL
      const placeholderUrl = `https://placehold.co/600x400/3b82f6/ffffff?text=${encodeURIComponent(file.name)}`;
      
      const updatedPhotos = [...currentPhotos, placeholderUrl];
      onPhotosUpdate(updatedPhotos);
    } catch (error) {
      console.error("Failed to upload photo:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFetchExternalPhotos = async () => {
    if (!selectedSource || !restaurantName.trim()) return;

    setIsLoadingExternal(true);
    
    try {
      const queries = getRestaurantSearchQueries(restaurantName.trim());
      const photos: string[] = [];
      
      for (const query of queries.slice(0, 2)) { // Limit to 2 queries to avoid rate limits
        try {
          const sourcePhotos = await fetchPhotosFromSource(selectedSource, query, apiKey);
          photos.push(...sourcePhotos);
        } catch (error) {
          console.error(`Failed to fetch photos for query "${query}":`, error);
        }
      }
      
      if (photos.length > 0) {
        const updatedPhotos = [...currentPhotos, ...photos.slice(0, 5)]; // Limit to 5 new photos
        onPhotosUpdate(updatedPhotos);
      } else {
        alert("No photos found. Try a different search term or check your API key.");
      }
    } catch (error) {
      console.error("Failed to fetch external photos:", error);
      alert("Failed to fetch photos. Please check your API key and try again.");
    } finally {
      setIsLoadingExternal(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Restaurant Photos</h3>
      
      {/* Current Photos */}
      {currentPhotos.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Current Photos</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {currentPhotos.map((photo, index) => (
              <div key={index} className="relative group">
                <img
                  src={photo}
                  alt={`Restaurant photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Photo by URL */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Add Photo by URL</h4>
        <div className="flex space-x-2">
          <Input
            value={newPhotoUrl}
            onChange={(e) => setNewPhotoUrl(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="flex-1"
          />
          <Button onClick={handleAddPhoto} disabled={!newPhotoUrl.trim()}>
            Add
          </Button>
        </div>
      </div>

      {/* Upload from File */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Upload from File</h4>
        <div className="flex items-center space-x-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleUploadFromFile}
            disabled={isUploading}
            className="flex-1"
          />
          {isUploading && (
            <span className="text-sm text-gray-500">Uploading...</span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Note: File uploads will create placeholder images. In production, integrate with a real image service.
        </p>
      </div>

      {/* External Photo Sources */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Fetch Photos from External Sources</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Restaurant Name
            </label>
            <Input
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="Enter restaurant name to search for photos"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo Source
            </label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Select a photo source</option>
              {photoSources.map((source) => (
                <option key={source.name.toLowerCase().replace(/\s+/g, '-')} value={source.name.toLowerCase().replace(/\s+/g, '-')}>
                  {source.name} - {source.pricing}
                </option>
              ))}
            </select>
          </div>

          {selectedSource && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key (required for external sources)
              </label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get API keys from: Google Cloud Console, Unsplash Developers, Pexels API, or Foursquare Developers
              </p>
            </div>
          )}

          <Button
            onClick={handleFetchExternalPhotos}
            disabled={!selectedSource || !restaurantName.trim() || !apiKey.trim() || isLoadingExternal}
            className="w-full"
          >
            {isLoadingExternal ? "Fetching Photos..." : "Fetch Photos"}
          </Button>
        </div>
      </div>

      {/* Photo Sources Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Available Photo Sources</h4>
        <div className="space-y-2">
          {photoSources.map((source) => (
            <div key={source.name} className="text-xs text-blue-800">
              <strong>{source.name}:</strong> {source.description}
              <br />
              <span className="text-blue-600">Pricing:</span> {source.pricing}
              <br />
              <span className="text-blue-600">Features:</span> {source.features.join(", ")}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
