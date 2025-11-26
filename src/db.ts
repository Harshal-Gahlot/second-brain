import mongoose from "mongoose";
import "dotenv/config";
console.log("connecting db");

mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => {
        console.log("db connected");
    })
    .catch((e) => {
        console.log("db error!!!!!!!!", e);
    });
    
export default mongoose;
