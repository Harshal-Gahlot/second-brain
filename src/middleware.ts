import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
    id: string;
}

export default function userMiddleware(req: Request, res: Response, next: NextFunction) {
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header as string, process.env.JWT_SECRET as string) as CustomJwtPayload;

    if (decoded) {
        req.body.userId = decoded.id;
        next();
        return;
    }
    res.send(403).json({ message: "jwt authentication failed, you're not logged in." });
}
