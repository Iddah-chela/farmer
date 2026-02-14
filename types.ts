export enum Grade {
  A = 'A',
  B = 'B',
  C = 'C',
}

export interface HarvestListing {
  id: string;
  farmerName: string;
  cropType: string;
  quantityKg: number;
  location: string; // County
  coordinates?: { lat: number; lng: number }; // Added specific coordinates
  grade: Grade;
  pricePerKg: number;
  imageUrl?: string;
  saturationLevel?: 'low' | 'medium' | 'high'; // Derived from supply data
}

export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  ESCROW_HELD = 'ESCROW_HELD', // Money with Pay Hero
  COMPLETED = 'COMPLETED', // Handshake done, funds released
  CANCELLED = 'CANCELLED'
}

export interface Order {
  id: string;
  listingId: string;
  buyerName: string;
  quantity: number;
  totalAmount: number;
  status: OrderStatus;
  mpesaTransactionId?: string;
  qrCodeData?: string;
}

export interface PayHeroResponse {
  success: boolean;
  message: string;
  transactionId?: string;
}

export enum UserRole {
  BUYER = 'BUYER',
  FARMER = 'FARMER',
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: Date;
  // Profile statistics
  totalTransactions: number;
  totalAmountSpent?: number; // For buyers
  totalAmountEarned?: number; // For farmers
  totalQuantitySold?: number; // For farmers in kg
  totalQuantityBought?: number; // For buyers in kg
  orders: Order[];
  listings?: HarvestListing[]; // For farmers
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, phone: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateUserStats: (updates: Partial<User>) => void;
}