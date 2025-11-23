// import mongoose from "mongoose";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// dotenv.config;
import { hash, compare } from "bcrypt";
import { email, z } from "zod";
import express from "express";
import mongoose from "./db.js";
import User from "./model/userMode.js";

console.log("imported everything");
const app = express();
app.use(express.json());

const PORT: number = 3000;

export const signUpZodSchema = z.object({
    username: z.string(),
    email: z.string(),
    password: z.string(),
});

app.post("/api/v1/signup", async (req, res) => {
    console.log("signup req came");

    try {
        const validateReq = signUpZodSchema.parse(req.body);
        const hashedPassword = await hash(validateReq.password, 10);
        const response = await User.create({
            username: validateReq.username,
            email: validateReq.email,
            password: hashedPassword,
        });
        console.log("response", response);
        console.log("success: username signed up", validateReq.username);
        res.status(201).send(`${validateReq.username}, ${validateReq.email}`);
    } catch { 
        console.log("server crashed while creating user");
        res.status(400).send("failed!!!"); 
    }
});

app.listen(PORT, () => {
    console.log("server is listening on port", PORT);
});

app.get("/api/v1/u/:username", (req, res) => {
    console.log("get user req came");
    const username = req.params.username;
    let found = null;

    if (found) res.status(200).send("success!");
    else res.status(404).send("no such user found, sign up sign up instead?");
});

app.post("/api/v1/signin", (req, res) => {});

app.post("/api/v1/content", (req, res) => {});

app.delete("/api/v1/content", (req, res) => {});

app.post("/api/v1/share", (req, res) => {});

app.post("/api/v1/brain/:shareLink", (req, res) => {});
