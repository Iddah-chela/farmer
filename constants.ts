export const KENYAN_COUNTIES = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Uasin Gishu", 
  "Kiambu", "Machakos", "Meru", "Nyeri", "Kakamega", 
  "Bungoma", "Trans Nzoia", "Narok", "Kajiado", "Kilifi"
];

export const CROPS = [
  "Maize", "Beans", "Potatoes", "Tea", "Coffee", "Avocado", "Mangoes", "Tomatoes", "Onions", "Cabbage"
];

export const MPESA_COLOR = "#24B04B";

// Mock saturation data for the marketplace
export const SATURATION_DATA: Record<string, 'low' | 'medium' | 'high'> = {
  "Maize": "high",
  "Beans": "medium",
  "Avocado": "low", // High demand
  "Coffee": "medium",
  "Tea": "high"
};

export const MOCK_LISTINGS = [
  {
    id: '1',
    farmerName: 'John Kamau',
    cropType: 'Maize',
    quantityKg: 5000,
    location: 'Uasin Gishu',
    coordinates: { lat: 0.5143, lng: 35.2698 }, // Eldoret area
    grade: 'A',
    pricePerKg: 3500, // Price in KES per bag usually, but let's assume normalized
    saturationLevel: 'high'
  },
  {
    id: '2',
    farmerName: 'Mary Wanjiku',
    cropType: 'Avocado',
    quantityKg: 200,
    location: 'Meru',
    coordinates: { lat: 0.0463, lng: 37.6559 }, // Meru area
    grade: 'A',
    pricePerKg: 80,
    saturationLevel: 'low'
  },
  {
    id: '3',
    farmerName: 'Peter Ochieng',
    cropType: 'Tomatoes',
    quantityKg: 1000,
    location: 'Kisumu',
    coordinates: { lat: -0.0917, lng: 34.7680 }, // Kisumu area
    grade: 'B',
    pricePerKg: 120,
    saturationLevel: 'medium'
  }
];