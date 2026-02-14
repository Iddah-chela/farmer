import { HarvestListing, Order, User, UserRole } from '../types';
import { MOCK_LISTINGS } from '../constants';

// Storage keys
const LISTINGS_KEY = 'payhero_listings';
const ORDERS_KEY = 'payhero_orders';

// Get all listings (mock + user-created)
export const getAllListings = (): HarvestListing[] => {
  const userListings = JSON.parse(localStorage.getItem(LISTINGS_KEY) || '[]');
  return [...MOCK_LISTINGS, ...userListings];
};

// Add a new listing
export const addListing = (listing: HarvestListing, userId: string): void => {
  const listings = JSON.parse(localStorage.getItem(LISTINGS_KEY) || '[]');
  listings.push(listing);
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
  
  // Also update user's listings array
  updateUserListings(userId, listing);
};

// Get listing by ID
export const getListingById = (id: string): HarvestListing | undefined => {
  return getAllListings().find(l => l.id === id);
};

// Save an order
export const saveOrder = (order: Order): void => {
  const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
  orders.push(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

// Get orders for a user
export const getUserOrders = (userId: string, userRole: UserRole): Order[] => {
  const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
  if (userRole === UserRole.BUYER) {
    return orders.filter((o: Order) => o.buyerName === userId);
  } else {
    // For farmers, find orders that match their listings
    const userListings = JSON.parse(localStorage.getItem(LISTINGS_KEY) || '[]');
    const farmerListingIds = userListings
      .filter((l: any) => l.farmerName === userId)
      .map((l: any) => l.id);
    return orders.filter((o: Order) => farmerListingIds.includes(o.listingId));
  }
};

// Update user's listings in their profile
const updateUserListings = (userId: string, listing: HarvestListing): void => {
  const users = JSON.parse(localStorage.getItem('payhero_users') || '[]');
  const userIndex = users.findIndex((u: any) => u.id === userId);
  
  if (userIndex !== -1) {
    if (!users[userIndex].listings) {
      users[userIndex].listings = [];
    }
    users[userIndex].listings.push(listing);
    localStorage.setItem('payhero_users', JSON.stringify(users));
  }
};

// Update user stats after a transaction
export const updateUserTransaction = (
  userId: string,
  order: Order,
  isCompleted: boolean = false
): void => {
  const users = JSON.parse(localStorage.getItem('payhero_users') || '[]');
  const userIndex = users.findIndex((u: any) => u.id === userId);
  
  if (userIndex !== -1) {
    const user = users[userIndex];
    
    // Add order to user's orders
    if (!user.orders) {
      user.orders = [];
    }
    const existingOrderIndex = user.orders.findIndex((o: Order) => o.id === order.id);
    if (existingOrderIndex === -1) {
      user.orders.push(order);
    } else {
      user.orders[existingOrderIndex] = order;
    }
    
    // Update statistics if completed
    if (isCompleted) {
      user.totalTransactions = (user.totalTransactions || 0) + 1;
      
      if (user.role === UserRole.BUYER) {
        user.totalAmountSpent = (user.totalAmountSpent || 0) + order.totalAmount;
        user.totalQuantityBought = (user.totalQuantityBought || 0) + order.quantity;
      } else if (user.role === UserRole.FARMER) {
        user.totalAmountEarned = (user.totalAmountEarned || 0) + order.totalAmount;
        user.totalQuantitySold = (user.totalQuantitySold || 0) + order.quantity;
      }
    }
    
    users[userIndex] = user;
    localStorage.setItem('payhero_users', JSON.stringify(users));
  }
};

// Delete a listing (for farmers to manage their listings)
export const deleteListing = (listingId: string, userId: string): void => {
  const listings = JSON.parse(localStorage.getItem(LISTINGS_KEY) || '[]');
  const updatedListings = listings.filter((l: HarvestListing) => 
    !(l.id === listingId && l.farmerName === userId)
  );
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(updatedListings));
  
  // Also remove from user's profile
  const users = JSON.parse(localStorage.getItem('payhero_users') || '[]');
  const userIndex = users.findIndex((u: any) => u.id === userId);
  
  if (userIndex !== -1 && users[userIndex].listings) {
    users[userIndex].listings = users[userIndex].listings.filter(
      (l: HarvestListing) => l.id !== listingId
    );
    localStorage.setItem('payhero_users', JSON.stringify(users));
  }
};
