import mongoose, { connect } from "mongoose";
// import { DB_NAME } from "../constants.js";


const MONGO_URI = process.env.MONGODB_URI

// console.log("This is mongo uri",MONGO_URI);


const connectDB = async () => {

    console.log("db/index file running");
    
    try {
        const connectionInstance = await mongoose.connect(`${MONGO_URI}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("MONGO DB CONNECTION FAILED", error);
        process.exit(1)
    }
}

export default connectDB