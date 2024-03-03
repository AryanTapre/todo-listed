import express from "express";
import {
    createTask,
    updateTask,
    createSubTask,
    getAllUserSubTasks,
    updateSubTask,
    deleteTask,
    deleteSubTask,
    getAllUserTasks
} from  "../controllers/task.controller.js";

import {auth} from "../middlewares/auth.middleware.js";

const taskRouter = express.Router();

taskRouter.route("/create-task").post(auth,createTask);
taskRouter.route("/update-task/:taskID").post(auth,updateTask);
taskRouter.route("/update-subtask").post(auth,updateSubTask);
taskRouter.route("/create-subtask/:taskID").get(auth,createSubTask);
taskRouter.route("/get-subtask/:taskID").get(auth,getAllUserSubTasks);
taskRouter.route("/delete-task/:taskID").get(auth,deleteTask);
taskRouter.route("/delete-subtask/:taskID").get(auth,deleteSubTask);
taskRouter.route("/get-tasks").get(auth,getAllUserTasks);




export {taskRouter};