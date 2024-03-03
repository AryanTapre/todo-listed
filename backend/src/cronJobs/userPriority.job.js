import User from "../models/user.model.js";
import Task from "../models/task.model.js";
import SubTask from "../models/subtask.model.js";
import cron from "node-cron";

import {
    getDaysGap,
    getUserWithHighestGap,
    assignPriorityToUser,
    insertByPriorityIn2DArray,
    callUser
}  from "../utiles/taskPriority.js";

function adjustUserPriorityCallCronJob() {
    cron.schedule('0 7 * * *',async () => { // scheduled to run daily at 7AM in the morning!.
        const users = await User.find();
        let userTasks = [];
    
        for (const user of users) {
            const tasks = await Task.find({userID: user._id});
            for (const task of tasks) {
                const subTask = await SubTask.find({taskID:task._id,deletedAt:{$exists:false}});
                if(subTask.length >=1 ) {
                   // userTasks.push(task);
                    // checking for over due tasks
                    let daysGap = getDaysGap(task.dueDate);
                    daysGap+= 1;
                    
                    console.log("day-gap:",daysGap);
                    if(daysGap >= 1) { // over-dued task
                       //console.log(task);
                       if(subTask[0].status == 0) { // task is overdued and pending!.
                            const obj = {
                            userID: user._id,
                            taskID: task._id,
                            daysGap: daysGap
                           }
        
                           userTasks.push(obj)
                       }
                    }
                }    
            }
        }
    
      
        const data = getUserWithHighestGap(userTasks); // returns array of objects userID's with thier highest gaps possible!.
        console.log(data);
        const userWithPriorities = assignPriorityToUser(data); // returns array of objects with priority assign to each userID
        console.log(userWithPriorities);
        const userPositionsIn2DArray = insertByPriorityIn2DArray(userWithPriorities);// returns 2D array user with 0 priority placed at 0th row and so on..
        console.log(userPositionsIn2DArray);


        /*  @Structure of userPositionsIn2DArray => 
         *  [
             0th row:0 priority   [ { userID: '65e302a7ecc1ef7bd450440d', called: false } ],
             1st row:1 priority   [ { userID: '65e302a7ecc1ef7bd450330e', called: false } ],
             2nd row:2 priority   [
                                    { userID: '65e302a7ecc1ef7bd450440e', called: false },
                                    { userID: '65e302a7ecc1ef9bd450440e', called: false }
                                  ]
            ]
         * 
         * 
         */


        /**     @Structure of userWithPriorities =>
         *      [   
         *          {
         *              userID:65e302a7ecc1ef7bd450440d,
         *              priority:0/1/2
         *          }
         *      ]
         * 
         *  */    
        
        // calling users whose tasks are over-dued and pending!.
        await callUser(userPositionsIn2DArray);
    })
}



export default adjustUserPriorityCallCronJob;