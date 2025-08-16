import mongoose from "mongoose"
import {config} from "../configs";

const connectDB= async ()=>{
    try{
        const connect=await mongoose.connect(config.mongoURI)
        console.log('connecting to DB was successful')
    }
    catch (e){
        console.log('something went wrong in connecting to the DB',e)
        process.exit(1)
    }
}
export default connectDB;
