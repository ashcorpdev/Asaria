import consolaGlobalInstance from "consola";
import teamModel from "./database/model/team";
import userModel from "./database/model/user";
const database = require('./database/database')
export = (io, socket) => {
  consolaGlobalInstance.log('Points module loaded.')

  async function givePointsToUsers(eventData: { username: string, points: Number}) {

    let user = userModel.findOne({ displayName: eventData.username })
    if (user == null) {
      consolaGlobalInstance.debug(`Creating user document for ${eventData.username}.`)
      let res = createUser(eventData.username)
      if (!res) {
        consolaGlobalInstance.error(`Unable to add ${eventData.username} to the database!`)
        return;
      }
      user = userModel.findOne({ displayName: eventData.username })
    }
    let prevPoints = user.get('points')
    let newPoints = prevPoints + eventData.points
    user.updateOne({ displayName: eventData.username}, {newPoints})
    consolaGlobalInstance.success(`Updated points for ${eventData.username} from ${prevPoints} to ${newPoints}`)

    }

  function userSpendPoints(teamName: string, username: string) {
    
    /** 
     * * PSEUDOCODE *
     * * Check username
     * * If user exists in the database, grab their current points.
     * * Evaluate the team from the event and modify the teams points while setting the users' points to 0.
     * * If user doesn't exist or doesn't have any points, tell them they don't have any points (to reduce number of read/writes). 
    */

  }

  function createUser(username: String) {
    let user = userModel.findOne({ displayName: username})
    if(user == null) {
      userModel.create({displayName: username, 'points': 0})
      return true
    }else {
      return false
    }
  }

  io.on("system:reset-user-points", async () => {
    let res = await userModel.updateMany({}, { points: 0 })
    consolaGlobalInstance.info(res)
  });

  io.on("system:reset-team-points", async () => {
    let res = await teamModel.updateMany({}, { points: 0 })
    consolaGlobalInstance.info(res)
  });


}