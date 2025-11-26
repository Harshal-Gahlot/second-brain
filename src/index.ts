// import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { hash, compare } from "bcrypt";
import { z } from "zod";
import express from "express";
import mongoose from "./db.js";
import User from "./model/userMode.js";

console.log("imported everything");
const app = express();
app.use(express.json());

const PORT: number = 3000;

export const signUpZodSchema = z.object({
    username: z.string(),
    email: z.email(),
    password: z.string(),
});
export const signInZodSchema = signUpZodSchema.omit({ username: true });

export type SignUpInfo = z.infer<typeof signUpZodSchema>;
export type SignInInfo = z.infer<typeof signInZodSchema>;

app.post("/api/v1/signup", async (req, res) => {
    console.log("signup req came");

    try {
        const validateReq: SignUpInfo = signUpZodSchema.parse(req.body);
        const checkIfUserAlreadyExist = await User.findOne({ email: validateReq.email });
        if (checkIfUserAlreadyExist) {
            return res.status(409).json({ mission: "failed", message: "user already exist, signup instead?" });
        }

        const hashedPassword = await hash(validateReq.password, 10);
        await User.create({
            username: validateReq.username,
            email: validateReq.email,
            password: hashedPassword,
        });

        console.log("success: username signed up", validateReq.username);
        res.status(201).json({ mission: "success", username: validateReq.username, email: validateReq.email });
    } catch (e: any) {
        if (e instanceof z.ZodError) {
            console.log("invalid input format, zod validation failed");
            res.status(401).json({ mission: "failed", message: "invalid input format, zod validation failed" });
        } else if (e.code === 11000) {
            console.log("user already exist");
            res.status(409).json({ mission: "failed", message: "user already exist, try login log in instead" });
        } else {
            console.log("Error signing up");
            res.status(500).json({ mission: "failed", message: "Error while signing up" });
        }
    }
});

app.get("/api/v1/u/:username", async (req, res) => {
    console.log("get user req came");
    let username;
    let found;
    try {
        username = z.string().parse(req.params.username);
        found = await User.findOne({ username }).select("-password").lean();
    } catch (e: any) {
        if (e instanceof z.ZodError) {
            console.log("zod validation error");
            return res.status(400).json({ mission: "failed", message: "zod validation error" });
        } else {
            console.log("error");
            return res.status(409).json({ mission: "failed", message: "user not found" });
        }
    }

    if (found) {
        console.log("sending user data of", username);
        return res.status(200).json({ mission: "success", message: "success!", data: found });
    }
    console.log("user doesn't exist with username:", username);
    res.status(400).json({ mission: "failed", message: "user doesn't exist" });
});

app.post("/api/v1/signin", async (req, res) => {
    console.log("sign in req came");
    try {
        const validateReq: Omit<SignUpInfo, "username"> = signUpZodSchema.omit({ username: true }).parse(req.body);
        const response = await User.findOne({ email: validateReq.email });
        console.log("response", response);

        if (!response) {
            return res.status(400).json({
                mission: "failed",
                message: "failed since email doesn't exist in db",
            });
        }

        if (!(await compare(validateReq.password, response.password))) {
            return res.status(403).json({ mission: "failed", message: "wrong password" });
        }

        const token = jwt.sign(validateReq.email, process.env.JWT_SECRET as string);

        console.log("you are signed in");
        res.status(200).json({ mission: "success", token });
    } catch (e: any) {
        if (e instanceof z.ZodError) {
            console.log("invalid input format, zod validation failed");
            res.status(401).json({ mission: "failed", message: "invalid input format, zod validation failed" });
        } else {
            console.log("Error signing in");
            res.status(400).json({ mission: "failed", message: "Error while signing in" });
        }
    }
});

app.post("/api/v1/content", (req, res) => {

});

app.delete("/api/v1/content", (req, res) => {});

app.post("/api/v1/share", (req, res) => {});

app.post("/api/v1/brain/:shareLink", (req, res) => {});

app.listen(PORT, () => {
    console.log("server is listening on port", PORT);
});
