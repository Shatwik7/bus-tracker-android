"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./database");
const auth_1 = require("./auth");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.get("/buses", (req, res) => {
    res.json(database_1.buses);
});
// Get all bus stops
app.get("/stops", (req, res) => {
    res.json(database_1.stops);
});
// Get bus by ID
app.get("/bus/:id", (req, res) => {
    const bus = database_1.buses.find(b => b.id === parseInt(req.params.id));
    bus ? res.json(bus) : res.status(404).json({ message: "Bus not found" });
});
app.get("/routes/:buseId", (req, res) => {
    const buseId = parseInt(req.params.buseId);
    const routes = database_1.bus_Routes.find(route => route.busId = buseId);
    routes ? res.json(routes) : res.json({ message: "No bus in this route" });
});
// Get next bus at a stop
app.get("/next-bus/:stopId", (req, res) => {
    const stopId = parseInt(req.params.stopId);
    const nextBus = database_1.buses.find(bus => bus.nextStop === stopId);
    nextBus ? res.json(nextBus) : res.json({ message: "No bus arriving soon" });
});
app.post("/login", auth_1.loginDriver);
// Get assigned bus details
app.get("/driver/bus", auth_1.authenticated, (req, res) => {
    const busId = req.busId ? Number(req.busId) : undefined;
    const bus = database_1.buses.find(b => b.id === busId);
    if (!bus) {
        res.status(404).json({ message: "Bus not found" });
        return;
    }
    res.json(bus);
});
// Update bus location (only for authenticated drivers)
app.put("/driver/update-location", auth_1.authenticated, (req, res) => {
    const { currentStop, nextStop, currentPassengers } = req.body;
    const bus = database_1.buses.find(b => b.id === Number(req.busId));
    if (!bus) {
        res.status(404).json({ message: "Bus not found" });
        return;
    }
    bus.currentStop = currentStop;
    bus.nextStop = nextStop;
    bus.currentPassengers = currentPassengers;
    res.json({ message: "Bus location updated", bus });
});
// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
