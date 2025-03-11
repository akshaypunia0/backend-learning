// require('dotenv').config(path: "./env") // Ye import ke consistency ko kharab krta hai, but ye perfectly work krega

import dotenv from 'dotenv'
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})


connectDB()








/*
import express from "express"

const app = express();



(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NMAE}`);

        app.on("error", (error) => {
            console.log("ERROR", error);
        })

        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on ${process.env.PORT}`);
            
        })

    } catch (error) {
        console.log("ERROR", error);
        throw error
    }
})()
*/