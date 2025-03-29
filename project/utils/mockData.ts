import { Bus, Driver, Stop, BusRoute } from '@/types/api';

export const drivers: Driver[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    busId: 1,
    profileImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
  },
];

export const buses: Bus[] = [
  {
    id: 1,
    number: 'BUS001',
    driver: 'John Doe',
    currentStop: 1,
    nextStop: 2,
    capacity: 50,
    currentPassengers: 30,
    status: 'ON_ROUTE',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 2,
    number: 'BUS002',
    driver: 'Jane Smith',
    currentStop: 3,
    nextStop: 4,
    capacity: 45,
    currentPassengers: 25,
    status: 'ON_ROUTE',
    lastUpdated: new Date().toISOString(),
  },
];

export const stops: Stop[] = [
  {
    id: 1,
    name: 'Central Station',
    latitude: 40.7128,
    longitude: -74.0060,
    address: '123 Main St',
    facilities: ['Shelter', 'Seating', 'Lighting'],
    busLines: ['BUS001', 'BUS002'],
  },
  {
    id: 2,
    name: 'Market Square',
    latitude: 40.7129,
    longitude: -74.0061,
    address: '456 Market St',
    facilities: ['Shelter', 'Seating'],
    busLines: ['BUS001'],
  },
  {
    id: 3,
    name: 'Tech Hub',
    latitude: 40.7130,
    longitude: -74.0062,
    address: '789 Tech Ave',
    facilities: ['Seating', 'Lighting'],
    busLines: ['BUS002'],
  },
  {
    id: 4,
    name: 'University',
    latitude: 40.7131,
    longitude: -74.0063,
    address: '321 College Rd',
    facilities: ['Shelter', 'Seating', 'Lighting'],
    busLines: ['BUS001', 'BUS002'],
  },
];

export const busRoutes: BusRoute[] = [
  {
    busId: 1,
    stops: [1, 2, 4],
    estimatedDuration: 45,
    distance: 12.5,
    frequency: 15,
  },
  {
    busId: 2,
    stops: [1, 3, 4],
    estimatedDuration: 40,
    distance: 11.2,
    frequency: 20,
  },
];