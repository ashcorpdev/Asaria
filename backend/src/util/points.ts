import consolaGlobalInstance from "consola";
import teamModel from "./database/model/team";
import userModel from "./database/model/user";
require('./database/database')
consolaGlobalInstance.log('Points module loaded.')

export default async function listenForEvents(io, socket) {

  io.on("system:reset-user-points", async () => {
    let res = await userModel.updateMany({}, { points: 0 })
    consolaGlobalInstance.info(res)
  });

  io.on("system:reset-team-points", async () => {
    let res = await teamModel.updateMany({}, { points: 0 })
    consolaGlobalInstance.info(res)
  });
}


export async function givePointsToUser(eventData: { username: string, points: Number}) {

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

export function userSpendPoints(teamName: string, username: string) {

  let user = userModel.findOne({ displayName: username})
  if(user == null) {
    console.log('User does not exist in the database. Not spending points.')
    // TODO: Send a chat message to user to say they have no points.
    return
  }
  let points = user.get('points')
  let team = teamModel.findOne( { allianceName: teamName })
  if(team != null) {
    let newPoints: Number = team.get('points') + points
    team.update( { points: newPoints})
  }

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