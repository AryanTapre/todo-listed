import cron from "node-cron";
import User from "../models/user.model.js";
import Task from "../models/task.model.js"
import SubTask from "../models/subtask.model.js"
import {adjustPriority, daysBetween} from "../utiles/taskPriority.js";

//TODO: for handling task priority
function cronJob () {
    // schedule to run daily
    cron.schedule('0 0 * * *',async () => { // scheduled to run after  24 hour
        try {
            const users = await User.find();
            for (const user of users) {
                const user_id = user._id;
                const tasks = await Task.find({userID: user_id});

                tasks.forEach( async (task) => {
                    const task_id = task._id;
                    const subTask = await SubTask.find({taskID: task_id});

                    // TODO: making sure that task priority should be change if it is not deleted!.
                    if(subTask.deletedAt === undefined) {
                        console.log("inside if");
                        let daysGap = daysBetween(task.dueDate)* -1;
                         //daysGap = daysGap - 1;

                        console.log(`daysGap for ${task.title} is : ${daysGap}`);

                        const newPriority = await adjustPriority(daysGap);
                        console.log("priority:=>",newPriority);

                        task.updateTaskPriorityCronJob(newPriority);
                        await task.save({validateBeforeSave:false});
                    }
                })

            }
        }
        catch (error) {
            console.log("error while fetching users!. =>",error);
        }
    })
}


export default cronJob;

