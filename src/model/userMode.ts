import { Schema, model } from "mongoose";


export interface IUser {
    _id?:string;
    username: string;
    email: string;
    password: string;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const UserModel = model<IUser>("User", userSchema);

export default UserModel;
