import jwt from "jsonwebtoken";
import { drivers } from "./database.js";
import { NextFunction, Request, Response } from "express";


declare global {
    namespace Express {
        interface Request {
            driverId?: string;
            busId?: string;
        }
    }
}

const SECRET_KEY = "secret_key";

export function loginDriver(req: Request, res: Response):void {
    const { email, password } = req.body;
    const driver = drivers.find(d => d.email === email && d.password === password);

    if (!driver) {
        res.status(401).json({ message: "Invalid credentials" });
        return 
    }

    const token = jwt.sign({ id: driver.id, busId: driver.busId}, SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "Login successful", token, driver });
    return 
}

export function authenticated(req: Request, res: Response, next: NextFunction):void {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token){
        res.status(403).json({ message: "No token provided" });
        return  
    } 

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Unauthorized" });
            return
        }

        if (decoded && typeof decoded === "object") {
            req.driverId = (decoded as any).id;
            req.busId = (decoded as any).busId;
        }
        next();
    });
}