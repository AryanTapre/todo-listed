import {ApiError} from "./apiError.js"
import {ApiResponse} from "./apiResponse.js"
import {asyncHandler} from  "./asyncHandler.js"

const setAccessToken = async(user,response) => {
    try{
        const accessToken = user.generateAccessToken();
        await user.save({validateBeforeSave:false})
        //TODO: Validity period for ACCESS TOKEN = 3 days

        const accessTokenOptions = {
            httpOnly:true,
            secure:true,
            expires: new Date(Date.now()+ 3 * 24 * 60 * 60 * 1000)
        }

        user.priority = undefined;
        user.password = undefined;

        return new Promise((resolve,reject) => {
                resolve(
                        response
                        .status(201)
                        .cookie("accessToken",accessToken,accessTokenOptions)
                        .json(
                            new ApiResponse(201,{accessToken,user},"user loggedIN successfully!.")
                        )
                )
        })
    }
    catch (error) {
        throw new ApiError(500,"unable to sent access-token to client",[error]);
    }
}


export {setAccessToken};