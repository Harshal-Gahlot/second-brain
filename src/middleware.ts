import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
    id: string;
}

export default function userMiddleware(req: Request, res: Response, next: NextFunction) {
    console.log("middleware req came")
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header as string, process.env.JWT_SECRET as string) as CustomJwtPayload;
    console.log('header', header)
    console.log('decoded', decoded)

    if (decoded) {
        req.userId = decoded.id;
        next();
        return;
    }
    res.status(403).json({ message: "jwt authentication failed, you're not logged in." });
}