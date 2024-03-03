import express from  "express";
import cors from 'cors';
import cookieParser from  'cookie-parser';
import {config} from "dotenv";
import morgan from  "morgan";

//TODO: importing all routes
import {userRouter} from  "../routes/user.route.js";
import {taskRouter} from "../routes/task.route.js";

config({
    path: 'src/environmentVariables/.env'
})

const app = express();
app.use(express.urlencoded({
    limit: '100mb',
    extended :true
}));
app.use(cookieParser());
app.use(express.json({
    limit:'100kb'
}));
app.use(morgan('tiny'));
app.use(cors({
    origin:`${process.env.CORS_ORIGIN}`,
    credentials:true // for permission to sent Headers
}))

app.use('/api/v1',userRouter);
app.use('/api/v1',taskRouter);

export {app};