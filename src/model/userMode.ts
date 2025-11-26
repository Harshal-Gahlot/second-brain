import { Schema, model } from "mongoose";

interface IUser {
    username: string;
    email: string;
    password: string;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, minlength: [3, "username must be 3 letters long"] },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: [6, "password must be 6 letters long"] },
});

const User = model<IUser>("user", userSchema);

export default User;
