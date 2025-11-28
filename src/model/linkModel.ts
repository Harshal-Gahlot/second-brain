import { model, Schema } from "mongoose";

export interface Ilink {
    hashLink: string;
    userId: Schema.Types.ObjectId;
}

const linkSchema = new Schema<Ilink>({
    hashLink: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});

const LinkModel = model("Link", linkSchema);

export default LinkModel;
