import express from "express";
import {signUp,signIn,getCurrentUserStatus,logOut} from  "../controllers/user.controller.js";
import {auth} from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.route("/signup").post(signUp);
userRouter.route("/signin").post(signIn);
userRouter.route("/status").get(auth,getCurrentUserStatus);
userRouter.route("/logout").get(auth,logOut);


export {userRouter};