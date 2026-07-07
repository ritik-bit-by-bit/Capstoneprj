import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (username: string, password: string, role: string, email: string) =>
    api.post('/auth/register', { username, password, role, email }),
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  requestPasswordReset: (email: string) =>
    api.post('/auth/password-reset/request', { email }),
  confirmPasswordReset: (email: string, otp: string, newPassword: string) =>
    api.post('/auth/password-reset/confirm', { email, otp, newPassword }),
};

export const customerAPI = {
  browseRestaurants: (name?: string, cuisine?: string, location?: string) =>
    api.get('/customer/restaurants', { params: { name, cuisine, location } }),
  viewMenu: (restaurantId: number) =>
    api.get(`/customer/restaurants/${restaurantId}/menu`),
  placeOrder: (restaurantId: number, items: Array<{ menuItemId: number; quantity: number }>) =>
    api.post('/customer/orders', { restaurantId, items }),
  orderHistory: () =>
    api.get('/customer/orders/history'),
  orderStatus: (orderId: number) =>
    api.get(`/customer/orders/${orderId}/status`),
  getPreferences: () =>
    api.get('/customer/preferences'),
  savePreferences: (favoriteRestaurantIds: number[], favoriteCuisines: string[], dietaryRestrictions: string[]) =>
    api.put('/customer/preferences', { favoriteRestaurantIds, favoriteCuisines, dietaryRestrictions }),
  recommendations: () =>
    api.get('/customer/recommendations'),
};

export const ownerAPI = {
  createRestaurant: (name: string, location: string, cuisine: string, rating: number) =>
    api.post('/owner/restaurants', { name, location, cuisine, rating }),
  updateRestaurant: (restaurantId: number, name: string, location: string, cuisine: string, rating: number) =>
    api.put(`/owner/restaurants/${restaurantId}`, { name, location, cuisine, rating }),
  myRestaurants: () =>
    api.get('/owner/restaurants'),
  addMenuItem: (restaurantId: number, name: string, description: string, price: number, specialTag?: string) =>
    api.post('/owner/menu-items', { restaurantId, name, description, price, specialTag }),
  updateMenuItem: (menuItemId: number, restaurantId: number, name: string, description: string, price: number, specialTag?: string) =>
    api.put(`/owner/menu-items/${menuItemId}`, { restaurantId, name, description, price, specialTag }),
  deleteMenuItem: (menuItemId: number) =>
    api.delete(`/owner/menu-items/${menuItemId}`),
  menuByRestaurant: (restaurantId: number) =>
    api.get(`/owner/restaurants/${restaurantId}/menu-items`),
  ownerOrders: () =>
    api.get('/owner/orders'),
  updateOrderStatus: (orderId: number, status: string) =>
    api.put(`/owner/orders/${orderId}/status`, { status }),
};

export default api;

