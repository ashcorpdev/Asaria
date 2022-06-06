import mongoose from "mongoose";
import { teamSchema } from "../schema/team";

 const teamModel = mongoose.model('team', teamSchema)

export = teamModel