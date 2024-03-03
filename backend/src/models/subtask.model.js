import mongoose from "mongoose";

const subTaskSchema = new mongoose.Schema({
    taskID: {
        type: mongoose.Schema.ObjectId,
        ref: "task",
        required:true
    },
    status: {
        type:Number,
        required:true,
        default: 0  // 0:Incomplete and 1: Complete
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date
    },
    deletedAt:{
        type: Date
    }
})

export default mongoose.model("subtask",subTaskSchema);