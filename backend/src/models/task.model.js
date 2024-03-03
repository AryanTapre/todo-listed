import mongoose from "mongoose";
import {adjustPriority, daysBetween} from "../utiles/taskPriority.js";

const taskSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.ObjectId,
        ref:"user",
        required:true
    },
    title: {
        type:String,
        required:true
    },
    description: {
        type:String,
        required:true
    },
    dueDate: {
        type:Date,
        required: true
    },
    status: { 
        type: String,
        enum:{
            values:["todo","done"],
            message:"status should either todo or done"
        }
    },
    priority: {
        type:Number
    },
    deletedAt: {
        type:Date
    }
})



taskSchema.post('save',async function(doc,next) {
    console.log("post")

    if (!doc._updatingPriority) { // prevents infinite Loop
        if(doc.dueDate || doc.isModified('dueDate')) {
            console.log("calling post");
            let days = daysBetween(doc.dueDate) * -1;
            // days = days - 1;
            doc.priority = adjustPriority(days);

            doc._updatingPriority = true;
            await doc.save();
            next();
        }
        else {
            next();
        }
    }

})

//TODO:called by cron job!.
taskSchema.methods.updateTaskPriorityCronJob =  function  (newPriority) {
    return  this.priority = newPriority;
}
export default mongoose.model("task",taskSchema);