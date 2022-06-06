import mongoose from "mongoose";
import { userSchema } from "../schema/user";

 const userModel = mongoose.model('user', userSchema)

export = userModel