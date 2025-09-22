// External photo source utilities for restaurants

export interface PhotoSource {
  name: string;
  description: string;
  apiEndpoint?: string;
  pricing?: string;
  features: string[];
}

export const photoSources: PhotoSource[] = [
  {
    name: "Google Places API",
    description: "Get photos from Google Maps restaurant listings",
    apiEndpoint: "https://maps.googleapis.com/maps/api/place/photo",
    pricing: "Pay per request (~$0.017 per photo)",
    features: [
      "Real restaurant photos",
      "High quality images",
      "Automatic updates",
      "Requires Google API key"
    ]
  },
  {
    name: "Unsplash API",
    description: "High-quality stock photos for restaurants",
    apiEndpoint: "https://api.unsplash.com/search/photos",
    pricing: "Free tier: 50 requests/hour",
    features: [
      "High quality stock photos",
      "Free tier available",
      "Wide variety of restaurant images",
      "Easy integration"
    ]
  },
  {
    name: "Pexels API",
    description: "Free stock photos with good restaurant selection",
    apiEndpoint: "https://api.pexels.com/v1/search",
    pricing: "Free tier: 200 requests/hour",
    features: [
      "Completely free",
      "Good restaurant photo selection",
      "High resolution images",
      "No attribution required"
    ]
  },
  {
    name: "Foursquare Places API",
    description: "Restaurant photos from Foursquare check-ins",
    apiEndpoint: "https://api.foursquare.com/v3/places/search",
    pricing: "Free tier: 1,000 requests/day",
    features: [
      "Real user photos",
      "Multiple photos per restaurant",
      "Free tier available",
      "Good coverage in major cities"
    ]
  }
];

export async function fetchPhotosFromSource(
  source: string,
  query: string,
  apiKey?: string
): Promise<string[]> {
  switch (source) {
    case "unsplash":
      return fetchUnsplashPhotos(query, apiKey);
    case "pexels":
      return fetchPexelsPhotos(query, apiKey);
    case "google":
      return fetchGooglePhotos(query, apiKey);
    case "foursquare":
      return fetchFoursquarePhotos(query, apiKey);
    default:
      throw new Error(`Unknown photo source: ${source}`);
  }
}

async function fetchUnsplashPhotos(query: string, apiKey?: string): Promise<string[]> {
  if (!apiKey) {
    throw new Error("Unsplash API key required");
  }

  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10`,
    {
      headers: {
        Authorization: `Client-ID ${apiKey}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Unsplash photos");
  }

  const data = await response.json();
  return data.results.map((photo: any) => photo.urls.regular);
}

async function fetchPexelsPhotos(query: string, apiKey?: string): Promise<string[]> {
  if (!apiKey) {
    throw new Error("Pexels API key required");
  }

  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=10`,
    {
      headers: {
        Authorization: apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Pexels photos");
  }

  const data = await response.json();
  return data.photos.map((photo: any) => photo.src.medium);
}

async function fetchGooglePhotos(query: string, apiKey?: string): Promise<string[]> {
  if (!apiKey) {
    throw new Error("Google Places API key required");
  }

  // First, search for places
  const placesResponse = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`
  );

  if (!placesResponse.ok) {
    throw new Error("Failed to search Google Places");
  }

  const placesData = await placesResponse.json();
  
  if (!placesData.results || placesData.results.length === 0) {
    return [];
  }

  // Get photos from the first result
  const place = placesData.results[0];
  if (!place.photos || place.photos.length === 0) {
    return [];
  }

  // Return photo URLs (you'd need to construct the actual photo URLs)
  return place.photos.slice(0, 5).map((photo: any) => 
    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${photo.photo_reference}&key=${apiKey}`
  );
}

async function fetchFoursquarePhotos(query: string, apiKey?: string): Promise<string[]> {
  if (!apiKey) {
    throw new Error("Foursquare API key required");
  }

  const response = await fetch(
    `https://api.foursquare.com/v3/places/search?query=${encodeURIComponent(query)}&limit=5`,
    {
      headers: {
        Authorization: apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Foursquare photos");
  }

  const data = await response.json();
  
  // Extract photos from the response
  const photos: string[] = [];
  data.results?.forEach((place: any) => {
    if (place.photos && place.photos.length > 0) {
      place.photos.forEach((photo: any) => {
        photos.push(photo.prefix + "600x400" + photo.suffix);
      });
    }
  });

  return photos.slice(0, 10);
}

// Helper function to get restaurant-specific search queries
export function getRestaurantSearchQueries(restaurantName: string, cuisine?: string): string[] {
  const queries = [
    restaurantName,
    `${restaurantName} restaurant`,
    `${restaurantName} interior`,
    `${restaurantName} food`,
  ];

  if (cuisine) {
    queries.push(`${cuisine} restaurant`, `${cuisine} food`);
  }

  return queries;
}
