// import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { hash, compare } from "bcrypt";
import { z } from "zod";
import express from "express";
import mongoose from "./db.js";
import UserModel from "./model/userMode.js";
import ContentModel from "./model/contentModel.js";
import userMiddleware from "./middleware.js";

console.log("imported everything");
const app = express();
app.use(express.json());

const PORT: number = 3000;

export const signUpZodSchema = z.object({
    username: z.string().min(3, "username must be 3 letters long"),
    email: z.email(),
    password: z.string().min(6, "password must be 6 letters long"),
});
export const signInZodSchema = signUpZodSchema.omit({ username: true });

const contentZodSchema = z.object({
    title: z.string(),
    link: z.string(),
    type: z.string(),
    userId: z.string(),
    tags: z.array(z.string()).optional(),
});

export type SignUpInfo = z.infer<typeof signUpZodSchema>;
export type SignInInfo = z.infer<typeof signInZodSchema>;

app.post("/api/v1/signup", async (req, res) => {
    console.log("signup req came");

    try {
        const validateReq: SignUpInfo = signUpZodSchema.parse(req.body);
        const checkIfUserAlreadyExist = await UserModel.findOne({ email: validateReq.email });
        if (checkIfUserAlreadyExist) {
            return res.status(409).json({ mission: "failed", message: "user already exist, signup instead?" });
        }

        const hashedPassword = await hash(validateReq.password, 10);
        await UserModel.create({
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
        found = await UserModel.findOne({ username }).select("-password").lean();
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
        const user = await UserModel.findOne({ email: validateReq.email });
        console.log("user", user);

        if (!user) {
            return res.status(400).json({
                mission: "failed",
                message: "failed since email doesn't exist in db",
            });
        }

        if (!(await compare(validateReq.password, user.password))) {
            return res.status(403).json({ mission: "failed", message: "wrong password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);

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

app.post("/api/v1/content", userMiddleware, async (req, res) => {
    try {
        const data = contentZodSchema.parse(req.body);

        const content = await ContentModel.create({
            link: data.link,
            type: data.type,
            title: data.title,
            userId: data.userId,
            tags: data.tags,
        });

        res.status(200).json({ mission: "success", message: "content successfully added" });
    } catch (e) {
        console.log("that mf threw this error:", e);
        console.log("\n\ndata:", req.body);
        res.status(400).json({ mission: "failed" });
    }
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
    try {
        const content = await ContentModel.findOne({ userId: req.body.userId }).populate("userId", "username email");
        res.status(200).json({ mission: "success", content });
    } catch (e) {
        console.log("error occurred brotha:", e);
    }
});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
    try {
        await ContentModel.deleteOne({ userId: req.body.userId });
        res.status(200).json({ mission: "success", message: "content deleted successfully" });
    } catch (e) {
        console.log("error occurred", e);
        res.status(400).json({ mission: "failed", error_message: e });
    }
});

app.post("/api/v1/share", userMiddleware, async (req, res) => {});

app.post("/api/v1/brain/:shareLink", async (req, res) => {});

app.listen(PORT, () => {
    console.log("server is listening on port", PORT);
});
