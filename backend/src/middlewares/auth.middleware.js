import {asyncHandler} from "../utiles/asyncHandler.js"
import {ApiError} from  "../utiles/apiError.js"
import jwt from "jsonwebtoken";

const auth = asyncHandler((request,response,next) => {
    const accessToken =
        request.cookies.accessToken ||
        request.header("Authorization")?.replace("Bearer ","") ||
        request.body.accessToken;

    if(!accessToken) {
        response
            .status(400)
            .json(new ApiError(400,"AccessToken was not found",["accessToken missing in cookies,header,body"]));
    }

    try {
        const decode = jwt.verify(accessToken,process.env.JWT_SECRET_KEY);
        if(!decode) {
                response
                .status(401)
                .json(new ApiError(401,"AccessToken is expired, renew it!."));
        }
        request.userID = decode.id;
        next();

    }
    catch (error) {
        throw new ApiError(500,"Error while verifying accessToken at auth middleware");
    }
})

export {auth};
