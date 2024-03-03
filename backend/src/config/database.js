import mongoose from "mongoose";
import express from "express";
import {ApiError} from '../utiles/apiError.js';
import {DB_NAME} from  "../constants/constants.js"

const app = express();

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_CONNECTION_URL}/${DB_NAME}`);
        app.on("error",(error) => {
            console.log(`Express can not talk to database! because: ${error}`);
            process.exit(1);
        })

        console.log(`CONNECTED WITH MONGOdb!!
            host:${connectionInstance.connection.host} 
            port:${connectionInstance.connection.port} 
            name:${connectionInstance.connection.name}
        `);
    }
    catch (error) {
        throw new ApiError(500,"Connection to DataBase Failed",[error]);
    }
}

export {connectDB}