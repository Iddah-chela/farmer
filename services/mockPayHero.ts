import { PayHeroResponse } from '../types';

/**
 * Pay Hero Service Mock
 * 
 * In a real Next.js app, these would be API routes located in /api/payment/
 * connecting to https://backend.payhero.co.ke/
 */

const DELAY_MS = 2000; // Simulate network latency for "Low Data Mode" feel

export const initiateSTKPush = async (phoneNumber: string, amount: number): Promise<PayHeroResponse> => {
  return new Promise((resolve) => {
    console.log(`[PayHero] Initiating STK Push to ${phoneNumber} for KES ${amount}`);
    
    setTimeout(() => {
      // Simulate success
      resolve({
        success: true,
        message: "STK Push sent. Please check your phone.",
        transactionId: `PH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      });
    }, DELAY_MS);
  });
};

/**
 * Simulates the Callback URL webhook. 
 * In production, Pay Hero hits your /api/payment/callback endpoint.
 * Here, we poll or just simulate the confirmation.
 */
export const checkTransactionStatus = async (transactionId: string): Promise<{ status: 'PENDING' | 'SUCCESS' | 'FAILED' }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Randomly succeed for demo purposes
      resolve({ status: 'SUCCESS' });
    }, 1500);
  });
};

/**
 * Simulates the B2C Disburse API.
 * This releases funds from Escrow to the Farmer.
 */
export const disburseFunds = async (farmerPhone: string, amount: number): Promise<PayHeroResponse> => {
  return new Promise((resolve) => {
    console.log(`[PayHero] Disbursing funds (B2C) to ${farmerPhone} - Amount: KES ${amount}`);
    setTimeout(() => {
      resolve({
        success: true,
        message: "Funds disbursed successfully to Farmer.",
        transactionId: `B2C-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      });
    }, DELAY_MS);
  });
};