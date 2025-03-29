import { Bus, Driver, Stop, BusRoute } from '@/types/api';

export const buses: Bus[] = [
  {
    id: 1,
    number: "B101",
    driver: "John Doe",
    currentStop: 1,
    nextStop: 2,
    capacity: 50,
    currentPassengers: 32,
    status: 'ON_ROUTE',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 2,
    number: "B202",
    driver: "Alice Smith",
    currentStop: 3,
    nextStop: 4,
    capacity: 45,
    currentPassengers: 28,
    status: 'ON_ROUTE',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 3,
    number: "B303",
    driver: "Bob Wilson",
    currentStop: 2,
    nextStop: 3,
    capacity: 50,
    currentPassengers: 41,
    status: 'STOPPED',
    lastUpdated: new Date().toISOString()
  }
];

export const drivers: Driver[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "123456",
    busId: 1,
    profileImage: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400"
  },
  {
    id: 2,
    name: "Alice Smith",
    email: "alice@example.com",
    password: "password",
    busId: 2,
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
  },
  {
    id: 3,
    name: "Bob Wilson",
    email: "bob@example.com",
    password: "securepass",
    busId: 3,
    profileImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400"
  }
];

export const stops: Stop[] = [
  {
    id: 1,
    name: "Main Street Station",
    latitude: 40.7128,
    longitude: -74.0060,
    address: "123 Main St, New York, NY",
    facilities: ["shelter", "seating", "lighting", "schedule_display"],
    busLines: ["B101", "B202"]
  },
  {
    id: 2,
    name: "Broadway Junction",
    latitude: 40.7158,
    longitude: -74.0020,
    address: "456 Broadway, New York, NY",
    facilities: ["shelter", "seating", "lighting"],
    busLines: ["B101", "B303"]
  },
  {
    id: 3,
    name: "Central Park South",
    latitude: 40.7851,
    longitude: -73.9683,
    address: "789 Central Park S, New York, NY",
    facilities: ["shelter", "seating", "lighting", "wifi"],
    busLines: ["B202", "B303"]
  },
  {
    id: 4,
    name: "Fifth Avenue Plaza",
    latitude: 40.7769,
    longitude: -73.9718,
    address: "1010 5th Ave, New York, NY",
    facilities: ["shelter", "seating", "lighting", "schedule_display", "wifi"],
    busLines: ["B101", "B202", "B303"]
  }
];

export const busRoutes: BusRoute[] = [
  {
    busId: 1,
    stops: [1, 2, 3, 4],
    estimatedDuration: 45,
    distance: 12.5,
    frequency: 15
  },
  {
    busId: 2,
    stops: [3, 4, 1, 2],
    estimatedDuration: 40,
    distance: 11.8,
    frequency: 20
  },
  {
    busId: 3,
    stops: [2, 3, 4, 1],
    estimatedDuration: 42,
    distance: 12.1,
    frequency: 18
  }
];