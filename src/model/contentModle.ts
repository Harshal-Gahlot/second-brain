import { Schema, Types, model } from "mongoose";

interface Icontent {
    type: "document" | "tweet" | "youtube" | "link";
    link: string;
    title: string;
    tags: string[];
    userID: Types.ObjectId;
}

const contentSchema = new Schema<Icontent>({
    type: {
        type: String,
        required: true,
        enum: ["document", "tweet", "youtube", "link"],
    },
    link: { type: String, required: true },
    title: { type: String, required: true },
    tags: [{ type: String, required: false }],
    userID: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});

const content = model<Icontent>("content", contentSchema);

export default content;
