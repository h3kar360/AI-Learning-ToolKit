import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error("No MONGODB_URI located");

let cached = global.mongoose;

if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function connectToDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI, {
                dbName: "LearningToolKitDB",
            })
            .then((m) => m)
            .catch((err) => console.error(err));
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
