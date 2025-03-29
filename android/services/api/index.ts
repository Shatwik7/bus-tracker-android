import axios, { AxiosError } from 'axios';
import { buses, drivers, stops, busRoutes } from './mockData';
import { Bus, Driver, Stop, BusRoute, LoginResponse, ApiError } from '@/types/api';

// Initialize axios instance
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.29.179:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler
const handleError = (error: AxiosError): ApiError => {
  return {
    message: error.response?.data?.message || 'An unexpected error occurred',
    code: error.code || 'UNKNOWN_ERROR',
    status: error.response?.status || 500,
  };
};

// API Service class
class ApiService {
  private static instance: ApiService;
  private token: string | null = null;

  private constructor() {}

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  setToken(token: string) {
    this.token = token;
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearToken() {
    this.token = null;
    delete api.defaults.headers.common['Authorization'];
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      // For mock data
      const driver = drivers.find(d => d.email === email && d.password === password);
      if (!driver) {
        throw new Error('Invalid credentials');
      }
      const token = 'mock_token_' + Date.now();
      return { token, driver };

      // For real API
      // const response = await api.post<LoginResponse>('/login', { email, password });
      // return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  }

  // Bus endpoints
  async getAllBuses(): Promise<Bus[]> {
    try {
      // For mock data
      return buses;

      // For real API
      // const response = await api.get<Bus[]>('/buses');
      // return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  }

  async getBusById(id: number): Promise<Bus> {
    try {
      // For mock data
      const bus = buses.find(b => b.id === id);
      if (!bus) throw new Error('Bus not found');
      return bus;

      // For real API
      // const response = await api.get<Bus>(`/bus/${id}`);
      // return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  }

  // Stop endpoints
  async getAllStops(): Promise<Stop[]> {
    try {
      // For mock data
      return stops;

      // For real API
      // const response = await api.get<Stop[]>('/stops');
      // return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  }

  async getNextBusAtStop(stopId: number): Promise<Bus | null> {
    try {
      // For mock data
      return buses.find(bus => bus.nextStop === stopId) || null;

      // For real API
      // const response = await api.get<Bus>(`/next-bus/${stopId}`);
      // return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  }

  // Route endpoints
  async getBusRoute(busId: number): Promise<BusRoute | null> {
    try {
      // For mock data
      return busRoutes.find(route => route.busId === busId) || null;

      // For real API
      // const response = await api.get<BusRoute>(`/routes/${busId}`);
      // return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  }

  // Driver endpoints
  async getDriverBus(): Promise<Bus | null> {
    try {
      if (!this.token) throw new Error('Not authenticated');

      // For mock data
      const driverId = parseInt(this.token.split('_')[2]);
      const driver = drivers.find(d => d.id === driverId);
      if (!driver) return null;
      return buses.find(b => b.id === driver.busId) || null;

      // For real API
      // const response = await api.get<Bus>('/driver/bus');
      // return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  }

  async updateBusLocation(currentStop: number, nextStop: number): Promise<Bus> {
    try {
      if (!this.token) throw new Error('Not authenticated');

      // For mock data
      const driverId = parseInt(this.token.split('_')[2]);
      const driver = drivers.find(d => d.id === driverId);
      if (!driver) throw new Error('Driver not found');
      
      const bus = buses.find(b => b.id === driver.busId);
      if (!bus) throw new Error('Bus not found');

      bus.currentStop = currentStop;
      bus.nextStop = nextStop;
      bus.lastUpdated = new Date().toISOString();
      
      return bus;

      // For real API
      // const response = await api.put<Bus>('/driver/update-location', { currentStop, nextStop });
      // return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  }
}

export const apiService = ApiService.getInstance();