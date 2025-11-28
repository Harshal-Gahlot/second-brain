import { Schema, Types, model } from "mongoose";

export interface Icontent {
    type: "document" | "tweet" | "youtube" | "link";
    link: string;
    title: string;
    tags: string[];
    userId: Types.ObjectId;
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
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});

const ContentModel = model<Icontent>("Content", contentSchema);

export default ContentModel;
