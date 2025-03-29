import express, { Request, Response } from 'express';
import cors from 'cors';
import { buses, bus_Routes,stops } from './database';
import {authenticated,loginDriver} from './auth';
import os from 'os';

// Function to get the local network IP
const getLocalIP = (): string => {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const config of iface || []) {
      if (config.family === 'IPv4' && !config.internal) {
        return config.address; // Return the first local network IP
      }
    }
  }
  return '127.0.0.1'; // Fallback to localhost
};

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/buses", (req, res) => {
    res.json(buses);
});

// Get all bus stops
app.get("/stops", (req, res) => {
    res.json(stops);
});

// Get bus by ID
app.get("/bus/:id", (req, res) => {
    const bus = buses.find(b => b.id === parseInt(req.params.id));
    bus ? res.json(bus) : res.status(404).json({ message: "Bus not found" });
});

app.get("/routes/:buseId",(req,res)=>{
    const buseId=parseInt(req.params.buseId);
    const routes=bus_Routes.find(route => route.busId=buseId);
    routes ? res.json(routes) : res.json({message:"No bus in this route"});
})

// Get next bus at a stop
app.get("/next-bus/:stopId", (req, res) => {
    const stopId = parseInt(req.params.stopId);
    const nextBus = buses.find(bus => bus.nextStop === stopId);
    nextBus ? res.json(nextBus) : res.json({ message: "No bus arriving soon" });
});



app.post("/login", loginDriver);
interface AuthenticatedRequest extends Request {
    busId?: string;
  }
  
// Get assigned bus details
app.get("/driver/bus", authenticated, (req: AuthenticatedRequest, res:Response) => {
  const busId = req.busId ? Number(req.busId) : undefined;
  const bus = buses.find(b => b.id === busId);
  if (!bus) {
    res.status(404).json({ message: "Bus not found" });
    return
  }
  res.json(bus);
});

// Update bus location (only for authenticated drivers)
app.put("/driver/update-location", authenticated, (req:Request, res:Response) => {
  const { currentStop, nextStop, currentPassengers } = req.body;
  const bus = buses.find(b => b.id === Number(req.busId));

  if (!bus) {
    res.status(404).json({ message: "Bus not found" });
    return
  } 

  bus.currentStop = currentStop;
  bus.nextStop = nextStop;
  bus.currentPassengers = currentPassengers;
  res.json({ message: "Bus location updated", bus });
});

// Start the server
const PORT = 3000;
const LOCAL_IP = getLocalIP();
app.listen(PORT, () => {
    console.log(`Server is running on http://${LOCAL_IP}:${PORT}   <-- use this in Android Emulator utile/api.ts`);
    console.log(`Server is running on http://localhost:${PORT}`);
});