export interface Driver {
    id: number;
    name: string;
    email: string;
    password: string;
    busId: number;
    profileImage?: string;
  }
  
  export interface Bus {
    id: number;
    number: string;
    driver: string;
    currentStop: number;
    nextStop: number;
    capacity: number;
    currentPassengers: number;
    status: 'ON_ROUTE' | 'STOPPED' | 'OUT_OF_SERVICE';
    lastUpdated: string;
  }
  
  export interface Stop {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    address: string;
    facilities: string[];
    busLines: string[];
  }
  
  export interface BusRoute {
    busId: number;
    stops: number[];
    estimatedDuration: number;
    distance: number;
    frequency: number;
  }
  
  export interface LoginResponse {
    token: string;
    driver: Driver;
  }
  
  export interface ApiError {
    message: string;
    code: string;
    status: number;
  }