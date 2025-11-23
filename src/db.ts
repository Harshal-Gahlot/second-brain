import mongoose from "mongoose";

console.log("connecting db");
mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => {
        console.log("db connected");
    })
    .catch(() => {
        console.log("db error!!!!!!!!");
    });
export default mongoose;
