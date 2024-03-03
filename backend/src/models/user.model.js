import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    phoneNumber: {
        type:String,
        minLength:[10,'mobile number should be  of 10 digits'],
        required: true
    },
    password: {
        type:String,
        select:false,
        minLength:[6,'Password should be atleast of 6 characters'],
        required:true
    },
    priority:{
        type:Number
    }
})

userSchema.pre('save',async function () {
    this.password = await bcrypt.hash(this.password,10);
})

userSchema.methods.isPasswordValidate = async function(userPassword) {
    return await bcrypt.compare(userPassword,this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {id: this._id},
        process.env.JWT_SECRET_KEY,
        {
            expiresIn:process.env.JWT_SECRET_EXPIRY
        }
    )
}

export default mongoose.model("user",userSchema);