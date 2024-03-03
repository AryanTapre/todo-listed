import {ApiError} from "./src/utiles/apiError.js";
import {app} from  "./src/config/app.js";
import {connectDB} from "./src/config/database.js"
import cronJobTaskPriority from "./src/cronJobs/taskPriority.job.js";
import cronJobUserPriority from "./src/cronJobs/userPriority.job.js";

connectDB()
    .then(() => {
        app.listen(process.env.SERVER_PORT,() => {
            console.log(`HTTP Server Is Online At ${process.env.SERVER_PORT} Port!.`);
        })

        //executing cron job for changing task priority runs daily
        cronJobTaskPriority();
        // executing cron job for assigning priorities to users whose tasks are over-dued and pending, And to call them via Twilio API
        cronJobUserPriority();


    })
    .catch((error) => {
        throw new ApiError(500,"unable to connect to database",[error]);
    })

