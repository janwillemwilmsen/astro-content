// src/lib/pocketbase.js
// @ts-nocheck
import PocketBase from 'pocketbase';

// Initialize the PocketBase client
export const pb = new PocketBase('http://localhost:8080');

// Authentication state object to track changes
export const authStore = {
  isValid: pb.authStore.isValid,
  token: pb.authStore.token,
  user: pb.authStore.model,
  // Callback listeners for auth state changes
  listeners: [],
  // Method to add a listener
  addListener(callback) {
    this.listeners.push(callback);
  },
  // Notify all listeners of a state change
  notify() {
    this.listeners.forEach(callback => callback(this));
  }
};

// Listen to PocketBase auth changes and update `authStore`
pb.authStore.onChange(() => {
  authStore.isValid = pb.authStore.isValid;
  authStore.token = pb.authStore.token;
  authStore.user = pb.authStore.model;
  authStore.notify(); // Notify listeners of the state change
});

// Function to authenticate with email and password
export async function loginWithEmail(email, password) {
  try {
    const authData = await pb.collection('users').authWithPassword(email, password);
    return authData;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Function to log out the user
export function logout() {
  pb.authStore.clear();
  authStore.notify(); // Notify listeners after logging out
}
