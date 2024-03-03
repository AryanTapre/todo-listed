import {ApiResponse} from  "../utiles/apiResponse.js"
import {ApiError} from "../utiles/apiError.js";
import {asyncHandler} from  "../utiles/asyncHandler.js";
import Task from "../models/task.model.js";
import SubTask from "../models/subtask.model.js";
import WhereClause from "../utiles/whereClause.js";

const createTask = asyncHandler(async (request,response) => {
    const {userTitle,userDescription,userDueDate} = request.body;

    if(!(userTitle && userDescription && userDueDate)) {
            response
            .status(400)
            .json(new ApiError(400,"All fields are required"));
    }

    const taskData = {
        userID: request.userID,
        title: userTitle,
        description:userDescription,
        dueDate:userDueDate,
        status:"todo",
    }

    const task = await Task.create(taskData);
    const taskCreated = await Task.findById(task._id).select("-userID -priority");

    if(!taskCreated) {
        response
            .status(500)
            .json(new ApiError(500,"Failed to create task",["unable to add entry of task onto database"]));
    }
    await task.save({validateBeforeSave:false});
    response
        .status(201)
        .json(new ApiResponse(201,taskCreated));

})


const createSubTask = asyncHandler(async (request,response) => {
    const userTaskID = request.params.taskID;
    if(!userTaskID) {
        throw new ApiError(404,"taskID in missing in parameters",["taskID not present in request.params.taskID"]);
    }
    const subTask = await SubTask.create({
        taskID: userTaskID,
    })

    const subTaskCreated = await SubTask.findById(subTask._id);
    if(!subTaskCreated) {
        response
            .status(500)
            .json(new ApiError(500,"subTask not created onto database",[`something went wrong to add entry of subtask for taskID: ${userTaskID}`]));
    }

    response
        .status(201)
        .json(new ApiResponse(201,subTaskCreated,`SubTask created successfully for taskID:${userTaskID}`));

})



const getAllUserTasks = asyncHandler(async (request,response) => {
    let data = [];

   try {

        const clause = new WhereClause(Task.find(),request.query);
        const result = clause.pagination(request.query.limit?request.query.limit:1);
        //console.log(result.options);  //{limit:5 skip:0}

        const tasks = await Task.find({userID:request.userID}).limit(result.options.limit).skip(result.options.skip);
        if(tasks.length < 1) {
            response.status(400).json(new ApiError(400,"no data found",["data limit is crossed!."]));
        }

        //console.log(tasks);

        for (const task of tasks) {
            const subTask = await SubTask.find({taskID:task._id,deletedAt:{$exists:false}});
            if(subTask.length >= 1) {
                data.push(task);
            }
        }

        if(request.query.filter == "priority") {
            data.sort((a,b) => a.priority - b.priority);
        }
        else if(request.query.filter == "dueDate") {
            data.sort((a,b) => a.dueDate - b.dueDate);
        }

        response
        .status(200)
        .json(new ApiResponse(200,data));


   } catch (error) {
        throw new ApiError(500,"interal error",[`${error}`]);
   }

})

const getAllUserSubTasks = asyncHandler(async (request,response) => {
        const userTaskID = request.params.taskID;
        if(!userTaskID) {
            throw new ApiError(404,"taskID in missing in parameters",["taskID not present in request.params.taskID"]);
        }

        const subTask = await SubTask.find({
            taskID: userTaskID
        });

        console.log("subTaskD => ", typeof subTask);

        if(Object.keys(subTask).length === 0) {
                 response
                .status(500)
                .json(new ApiError(500,`subTask does not exists for TaskID: ${userTaskID}`));
        }
        response
            .status(200)
            .json(new ApiResponse(200,subTask));

})

const selectDataToUpdate = (...data) => {
    let values = [];
    for (let n of data) {
        if(n.data) {
            values.push(n.type);
        }
    }
    return values;
}

const updateTask = asyncHandler(async (request,response) => {
        // accepting taskID from request.params
        // accepting dueDate or status from request.body
        const userTaskID = request.params.taskID;
        if(!userTaskID) {
            throw new ApiError(404,"taskID or status in missing in parameters or body",["taskID or status not present in request.params.taskID or request.body.status"]);
        }

        const data = [
            {
                type: "dueDate",
                data: request.body.dueDate
            },
            {
                type: "status",
                data: request.body.status
            }
        ]

        const selectedData = selectDataToUpdate(...data);
        let updateTaskData = {};

        for (const d of selectedData) {
            switch (d) {
                case 'status':
                    updateTaskData.status = request.body.status;
                break;
                case 'dueDate':
                    updateTaskData.dueDate = request.body.dueDate;
                break;
            }
        }

        const result = await Task.findOneAndUpdate({_id: userTaskID},updateTaskData,{
            new:true,
            runValidators: true
        })

        if(!result) {
            response
                .status(500)
                .json(new ApiError(500,"failed to updated task at Database"));
        }

        await result.save({validateBeforeSave:false});
         response
        .status(201)
        .json(new ApiResponse(201,updateTaskData,"task updated Successfully"));
})

const updateSubTask = asyncHandler(async (request,response) => {
    //accepting taskID from request.body.taskID
    //accepting status from request.body.status

    const userTaskID = request.body.taskID;
    const statusToUpdate = Number(request.body.status);
    if((userTaskID === undefined) || (statusToUpdate === undefined)) {
        throw new ApiError(404,"taskID or status in missing in parameters or body",["taskID or status not present in request.params.taskID or request.body.status"]);
    }

    const result = await SubTask.findOneAndUpdate({taskID: userTaskID},{
        status: statusToUpdate
    },{
        new:true,
    })

    if(!result) {
            response
            .status(500)
            .json(new ApiError(500,"failed to updated sub-task at Database"));
    }

    await result.save({validateBeforeSave:false});
        response
        .status(201)
        .json(new ApiResponse(201,{userTaskID,statusToUpdate},"sub-task updated Successfully"));

})

const deleteTask = asyncHandler(async (request,response) => {
    //accepting taskID from request.params.taskID
    const task_id = request.params.taskID;
    if(!task_id) {
        response
            .status(400)
            .json(new ApiError(400,"taskID is missing",["taskID not found in request.params.taskID"]));
    }

    const result = await Task.findOneAndUpdate({_id: task_id},{
        deletedAt: new Date().toISOString()
    },{
        new:true
    })

    if(!result) {
            response
            .status(500)
            .json(new ApiError(500,"failed to Soft-Delete task at Database"));
    }

    await result.save({validateBeforeSave:false});
    response
        .status(201)
        .json(new ApiResponse(201,{result},"task Soft-Deleted  Successfully"));

})

const deleteSubTask = asyncHandler(async (request,response) => {
    //accepting taskID from request.params.taskID
    const taskid = request.params.taskID;
    if(!taskid) {
        response
            .status(400)
            .json(new ApiError(400,"taskID is missing",["taskID not found in request.params.taskID"]));
    }

    const result = await SubTask.findOneAndUpdate({taskID: taskid},{
        deletedAt: new Date().toISOString()
    },{
        new:true
    })

    if(!result) {
        response
            .status(500)
            .json(new ApiError(500,"failed to Soft-Delete Sub-task at Database"));
    }

    await result.save({validateBeforeSave:false});
    response
        .status(201)
        .json(new ApiResponse(201,{result},"Sub-task Soft-Deleted  Successfully"));
})

export {
    createTask,
    createSubTask,
    getAllUserTasks,
    getAllUserSubTasks,
    updateTask,
    updateSubTask,
    deleteTask,
    deleteSubTask
};