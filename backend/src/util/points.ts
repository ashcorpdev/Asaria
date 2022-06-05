export = (io, socket) => {

// TODO: Add Database functionality here.
  function givePointsToUsers(eventData: { username: string, points: Number}) {
    
    /** 
     * * PSEUDOCODE *
     * * Check eventData for user
     * * If user exists in the database, store their current points.
     * * Evaluate the additional points from the eventData and modify the user record.
     * * If user doesn't exist, create the user and set their points to the points from the eventData (to reduce number of read/writes). 
    */
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

  io.on("system:reset-user-points", () => {
  });

  io.on("system:reset-team-points", () => {

  });


}