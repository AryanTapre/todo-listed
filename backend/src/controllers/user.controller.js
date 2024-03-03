import User from "../models/user.model.js";
import {asyncHandler} from  "../utiles/asyncHandler.js";
import {ApiError} from "../utiles/apiError.js";
import {ApiResponse} from "../utiles/apiResponse.js";
import {setAccessToken} from "../utiles/cookieToken.js";
import SubTask from "../models/subtask.model.js"
import Task from "../models/task.model.js";

const logOut = asyncHandler((request,response) => {
    const options = {
        httpOnly:true,
        secure:true,
        expires: new Date(Date.now())
    }

    try {
        response
        .status(200)
        .clearCookie("accessToken",options)
        .json(new ApiResponse(200,"logout successfully"));

    } catch (error) {
        throw new ApiError(200,"unable to logout",[`${error}`]);
    }
})

const signUp = asyncHandler( async(request,response) => {
    const {phoneNumber,password} = request.body;

    if([phoneNumber,password].some((field) => field?.trim() === "")) {
        throw new ApiError(400,"All field are required!");
    }

    const existedUser = await User.findOne({
        phoneNumber: phoneNumber
    })

    if(existedUser) {
        response
            .status(200)
            .json(new ApiError(200,"user already exists!."));
    }

    const user = await User.create({
        phoneNumber,
        password
    })

    const createdUser = await User.findById(user._id).select("-phoneNumber -priority");
    if(!createdUser) {
       response
           .status(201)
           .json(new ApiError(201,"failed to register user!.",["unable to write entry on database"]));
    }

    return response
        .status(201)
        .json(new ApiResponse(201,"User registered Successfully!."));
})

const signIn = asyncHandler( async(request,response) => {
    const accessToken =
        request.cookies.accessToken ||
        request.header("Authorization")?.replace("Bearer ","") ||
        request.body.accessToken;

    if(accessToken) {
        response
            .status(200)
            .json(new ApiError(200,"user is already loggedIN",["user attempted an login, was already loggedIn"]));
    }

    const {phoneNumber,password} = request.body;
    if(!(phoneNumber && password)) {
         response
             .status(400)
             .json(new ApiError(404,"all fields are required!.",["missing either phoneNumber or password"]));
    }

    const user = await User.findOne({
        phoneNumber
    }).select("+password");

    if(!user) {
            return response
            .status(401)
            .json(new ApiError(404,"user with phoneNumber does not exists",["user entered wrong phone-number"]));
    }

    const isPasswordValid = await user.isPasswordValidate(password);
    if(!isPasswordValid) {
        response.json(new ApiError(404,"password in invalid",["Invalid Password"]));
    }
    await setAccessToken(user,response);

})


const getCurrentUserStatus = asyncHandler(async(request,response) => {
    const user_id = request.userID;
    let currentStatus = undefined;
    let koo = 0;
   
    console.log("inside user status:",user_id);

    try {
        const userTasks = await Task.find({
            userID:user_id,
            deletedAt: {
                $exists:false
            }}
        )
        let subTaskSize = 0;
       
        let statusCompleteCount = 0;
        let statusIncompleteCount = 0;
        
        console.log("userTasks Size=>",userTasks.length);
        for (let index = 0; index < userTasks.length; index++) {
            const subTask = await SubTask.find({taskID: userTasks[index]._id,deletedAt:{$exists:false}});
            if(subTask.length >= 1) {
                ++subTaskSize;
            }
            
            if(subTask[0].status == 1) {
                statusCompleteCount++;
            } else {
                statusIncompleteCount++;
            }

        }   
              
        
        if(statusCompleteCount == subTaskSize) {
            currentStatus = "DONE";
        } else if(statusIncompleteCount == subTaskSize) {
            currentStatus = "TODO";
        } else {
            currentStatus = "IN_PROGRESS";
        }

       
        response
            .status(200)
            .json(new ApiResponse(200,{
                userCurrentStatus:currentStatus
            }))
 
    } catch (error) {
        throw new ApiError(500,"Something went wrong while calculating user status",[`${error}`]);
    }
})

export {
    signUp,
    signIn,
    getCurrentUserStatus,
    logOut
};