import mongoose from "mongoose";
import dotenv from 'dotenv';
import { terser } from '@rollup/plugin-terser';

dotenv.config();
const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongoose Connected!!!");
        
    } catch (error) {
        console.log("Connection Failed",error);
        process.exit(1);
        
    }
}
export default connectDB;