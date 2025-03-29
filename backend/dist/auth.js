"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticated = exports.loginDriver = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_js_1 = require("./database.js");
const SECRET_KEY = "secret_key";
function loginDriver(req, res) {
    const { email, password } = req.body;
    const driver = database_js_1.drivers.find(d => d.email === email && d.password === password);
    if (!driver) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ id: driver.id, busId: driver.busId }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "Login successful", token, driver });
    return;
}
exports.loginDriver = loginDriver;
function authenticated(req, res, next) {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(403).json({ message: "No token provided" });
        return;
    }
    jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        if (decoded && typeof decoded === "object") {
            req.driverId = decoded.id;
            req.busId = decoded.busId;
        }
        next();
    });
}
exports.authenticated = authenticated;
