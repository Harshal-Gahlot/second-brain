import { Schema, model } from "mongoose";

interface IUser {
    username: string;
    email: string;
    password: string;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, minlength: [3, "username must be 3 letters long"] },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Remove minlength since we hash the password
});

const UserModel = model<IUser>("User", userSchema);

export default UserModel;
