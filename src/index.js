// require('dotenv').config(path: "./env") // Ye import ke consistency ko kharab krta hai, but ye perfectly work krega
console.log("Main index.js file running");

import { app } from './app.js';
import dotenv from 'dotenv'
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})

const serverPort = process.env.PORT || 8000


// connectDB() is a async function so it always returns a promise a promise, we need to handle it using .then 
connectDB()
.then(() => {
    app.on("error", (error) => {
        console.log("Error at .then", error);
    })

    app.listen(serverPort, () => {
        console.log(`Server is running at port: ${serverPort}`);
        
    })
})
.catch((error) => {
    console.log("MongoDB connection failed !!!", error);
})








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