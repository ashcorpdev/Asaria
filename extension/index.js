"use strict";

/* --------------------------------------------

  NODECG - REGISTER REQUIRED LIBRARIES HERE

-------------------------------------------- */
const fs = require("fs");
const path = require("path");
const { debug } = require("../debug")
const { client } = require("./twitch/client")

/* --------------------------------------------

  NODECG - REGISTER FILES HERE

-------------------------------------------- */

let config = fs.readFileSync(path.resolve(__dirname, "../config.json"));

let file = fs.readFileSync(
  path.resolve(__dirname, "../userlist-alliances.json")
);
let userlist = JSON.parse(file);

let teamlist = fs.readFileSync(
  path.resolve(__dirname, "../teamlist-alliances.json")
);
let teams = JSON.parse(teamlist);

/* --------------------------------------------

  NODECG - REGISTER INITIAL SETUP HERE

-------------------------------------------- */

let firstdonation = true;
let firstcheer = true;
let firstsubscription = true;

module.exports = nodecg => {

/* --------------------------------------------

  NODECG - REGISTER REPLICANTS HERE

-------------------------------------------- */
  const latestDonation = nodecg.Replicant("latestDonation", {
    defaultValue: 0,
  });
  const latestSubscription = nodecg.Replicant("latestSubscription", {
    defaultValue: 0,
  });
  const latestCheer = nodecg.Replicant("latestCheer", { defaultValue: 0 });
  const teamPoints = nodecg.Replicant("teamPoints", { defaultValue: 0 });
  const t1sub = nodecg.Replicant("t1sub", { defaultValue: 5 });
  const t2sub = nodecg.Replicant("t2sub", { defaultValue: 10 });
  const t3sub = nodecg.Replicant("t3sub", { defaultValue: 15 });
  const giftedsub = nodecg.Replicant("giftedsub", { defaultValue: 1 });
  const subgifter = nodecg.Replicant("subgifter", { defaultValue: 1 });
  const tip = nodecg.Replicant("tip", { defaultValue: 1 });
  const cheer = nodecg.Replicant("cheer", { defaultValue: 1 });
  const enableCounting = nodecg.Replicant("enableCounting", { defaultValue: true });

  teamPoints.value = {
    eternalflame: teams.eternalflame,
    wintersembrace: teams.wintersembrace,
    etherealbloom: teams.etherealbloom,
    shadowgrove: teams.shadowgrove,
  };

/* --------------------------------------------

  NODECG - REGISTER FUNCTIONS HERE

-------------------------------------------- */
  function checkGifted(newValue) {
    let gifterName = newValue.gifter;
    if (gifterName !== "" && gifterName !== null) {
      debug("Gifter: " + gifterName, false);
      return true;
    } else {
      return false;
    }
  }

  function givePoints(tier, newValue, gifted) {
    let points = 0;
    let initialPoints = 0;
    let updatedPoints = 0;
    let data = JSON.stringify(userlist, null, 2);
    let gifterName = newValue.gifter;
    file = fs.readFileSync(
      path.resolve(__dirname, "../userlist-alliances.json")
    );
    userlist = JSON.parse(file);
    switch (tier) {
      case "1000":
        points = t1sub.value;
        break;
      case "2000":
        points = t2sub.value;
        break;
      case "3000":
        points = t3sub.value;
        break;
      case "Prime":
        points = t1sub.value;
        break;
    }
    if (gifted) {
      // do gifted things

      if (userlist.hasOwnProperty(newValue.gifter.toLowerCase())) {
        // Gifter found in file
        initialPoints = userlist[newValue.gifter.toLowerCase()];
        debug("Extension - Gifter found in file; adding points.", true);
        updatedPoints = Math.floor(subgifter.value) + initialPoints;
        userlist[newValue.gifter.toLowerCase()] = updatedPoints;
        // Formats to human-readable when updating the json file.
        data = JSON.stringify(userlist, null, 2);
        fs.writeFileSync(
          path.resolve(__dirname, "../userlist-alliances.json"),
          data
        );
        debug("Extension - New gifter points: " + updatedPoints, true);
      } else {
        // Gifter not found in file
        debug("Extension - Gifter not found in file; adding.", true);
        userlist[newValue.gifter.toLowerCase()] = Math.floor(subgifter.value);
        // Formats to human-readable when updating the json file.
        data = JSON.stringify(userlist, null, 2);
        fs.writeFileSync(
          path.resolve(__dirname, "../userlist-alliances.json"),
          data
        );
        debug(
          "Extension - New gifter points: " + Math.floor(subgifter.value), true
        );
      }

      if (userlist.hasOwnProperty(newValue.name.toLowerCase())) {
        debug("Giftee found in file; adding points.", true);
        initialPoints = userlist[newValue.name.toLowerCase()];
        debug(initialPoints, false);
        updatedPoints = Math.floor(giftedsub.value) + initialPoints;
        userlist[newValue.name.toLowerCase()] = updatedPoints;
        // Formats to human-readable when updating the json file.
        data = JSON.stringify(userlist, null, 2);
        fs.writeFileSync(
          path.resolve(__dirname, "../userlist-alliances.json"),
          data
        );
        debug(updatedPoints, false);
      } else {
        // userlist not found in list
        debug("Giftee not in file; adding.", true);
        debug(newValue.name.toLowerCase(), true);
        userlist[newValue.name.toLowerCase()] = Math.floor(giftedsub.value);
        // Formats to human-readable when updating the json file.
        data = JSON.stringify(userlist, null, 2);
        fs.writeFileSync(
          path.resolve(__dirname, "../userlist-alliances.json"),
          data
        );
        debug(updatedPoints, false);
      }
    } else {
      // do non-gifted things

      if (userlist.hasOwnProperty(newValue.name.toLowerCase())) {
        initialPoints = userlist[newValue.name.toLowerCase()];
        debug(initialPoints, false);
        updatedPoints = Math.floor(points) + initialPoints;
        userlist[newValue.name.toLowerCase()] = updatedPoints;
        // Formats to human-readable when updating the json file.
        data = JSON.stringify(userlist, null, 2);
        fs.writeFileSync(
          path.resolve(__dirname, "../userlist-alliances.json"),
          data
        );
        debug(updatedPoints, false);
      } else {
        // userlist not found in list
        userlist[newValue.name.toLowerCase()] = Math.floor(points);
        // Formats to human-readable when updating the json file.
        data = JSON.stringify(userlist, null, 2);
        fs.writeFileSync(
          path.resolve(__dirname, "../userlist-alliances.json"),
          data
        );
        debug("Extension - new points: " + points, true);
      }
    }
  }

  function updateTeamPoints(teamName, username, channel) {
    // TODO - Check team submitted is valid *before* calculation!
    let teamlist = fs.readFileSync(
      path.resolve(__dirname, "../teamlist-alliances.json")
    );
    let teams = JSON.parse(teamlist);

    file = fs.readFileSync(
      path.resolve(__dirname, "../userlist-alliances.json")
    );
    userlist = JSON.parse(file);
    if (userlist.hasOwnProperty(username.toLowerCase())) {
      if (userlist[username] <= 0) {
        client.say(
          channel,
          `@${username}, you don't have any points to spend!`
        );
      } else {
        let userPoints = userlist[username];
        debug(`Found ${username.toLowerCase()} in the list, spending ${userPoints} points!`, true);
        let oldTeamPoints = teams[teamName];
        let newPoints = oldTeamPoints + userlist[username];
        debug(
          `Old ${teamName} points: ` + oldTeamPoints + ` New ${teamName} Points: ` + newPoints, true
        );
        userlist[username] = 0;
        teams[teamName] = newPoints;
        const data1 = JSON.stringify(userlist, null, 2);
        fs.writeFileSync(
          path.resolve(__dirname, "../userlist-alliances.json"),
          data1
        );

        const data2 = JSON.stringify(teams, null, 2);
        fs.writeFileSync(
          path.resolve(__dirname, "../teamlist-alliances.json"),
          data2
        );
        teamPoints.value = {
          eternalflame: teams.eternalflame,
          wintersembrace: teams.wintersembrace,
          etherealbloom: teams.etherealbloom,
          shadowgrove: teams.shadowgrove,
        };
        client.say(
          channel,
          `@${username}, you spent ${userPoints} points on team ${teamName}!`
        );
      }
    } else {
      debug(`${username.toLowerCase()} not found, no points available`, false);
      client.say(channel, `@${username}, you don't have any points to spend!`);
    }
  }

/* --------------------------------------------

  NODECG - REGISTER LISTENERS HERE

-------------------------------------------- */
teamPoints.on("change", (newValue, oldValue) => {
  let teamlist = fs.readFileSync(
    path.resolve(__dirname, "../teamlist-alliances.json")
  );
  let teams = JSON.parse(teamlist);
});

latestDonation.on("change", (newValue, oldValue) => {
  file = fs.readFileSync(
    path.resolve(__dirname, "../userlist-alliances.json")
  );
  userlist = JSON.parse(file);
  // Checks if the userlist already exists in the file.
  if (userlist.hasOwnProperty(newValue.name.toLowerCase())) {
    if (firstdonation === true) {
      firstdonation = false;
    } else {

  debug(`latestDonation updated!`, true);
      debug("New donation: " + newValue.name, true);
      //debug('Not first load, updating file');
      const pointsCalc = newValue.amount * tip.value;
      const initialPoints = userlist[newValue.name.toLowerCase()];
      debug(initialPoints, false);
      const updatedPoints = pointsCalc + initialPoints;
      userlist[newValue.name.toLowerCase()] = updatedPoints;
      // Formats to human-readable when updating the json file.
      const data = JSON.stringify(userlist, null, 2);
      fs.writeFileSync(
        path.resolve(__dirname, "../userlist-alliances.json"),
        data
      );
      debug(updatedPoints, false);
    }
  } else {
    debug("User not found!", false);

    // 5 is equal to number of points per £5 donation.
    const pointsCalc = newValue.amount * tip.value;
    // Rounds the points down to the nearest integer.
    const actualPoints = Math.floor(pointsCalc);
    debug(actualPoints, false);
    // Adds the new userlist and their point value to the object.
    userlist[newValue.name.toLowerCase()] = actualPoints;
    // Formats to human-readable when updating the json file.
    const data = JSON.stringify(userlist, null, 2);
    fs.writeFileSync(
      path.resolve(__dirname, "../userlist-alliances.json"),
      data
    );
  }
});

latestCheer.on("change", (newValue, oldValue) => {
  file = fs.readFileSync(
    path.resolve(__dirname, "../userlist-alliances.json")
  );
  userlist = JSON.parse(file);
  // Checks if the userlist already exists in the file.
  if (userlist.hasOwnProperty(newValue.name.toLowerCase())) {
    if (firstcheer === true) {
      firstcheer = false;
    } else {
      debug(`latestCheer updated!`, true);
      debug(`${newValue.name} found!`, true);
      const pointsCalc = (newValue.amount / 100) * cheer.value;
      // Rounds the points down to the nearest integer.
      const actualPoints = Math.floor(pointsCalc);
      const initialPoints = userlist[newValue.name.toLowerCase()];
      const updatedPoints = actualPoints + initialPoints;
      userlist[newValue.name.toLowerCase()] = updatedPoints;
      // Formats to human-readable when updating the json file.
      const data = JSON.stringify(userlist, null, 2);
      fs.writeFileSync(
        path.resolve(__dirname, "../userlist-alliances.json"),
        data
      );
    }
  } else {
    debug("User not found!", false);
    // 5 is equal to number of points per £5 donation.
    const pointsCalc = (newValue.amount / 100) * cheer.value;
    // Rounds the points down to the nearest integer.
    const actualPoints = Math.floor(pointsCalc);
    // Adds the new userlist and their point value to the object.
    userlist[newValue.name.toLowerCase()] = actualPoints;
    // Formats to human-readable when updating the json file.
    const data = JSON.stringify(userlist, null, 2);
    fs.writeFileSync(
      path.resolve(__dirname, "../userlist-alliances.json"),
      data
    );
  }
});

// TODO - Support PRIME Subs
latestSubscription.on("change", (newValue, oldValue) => {
  file = fs.readFileSync(
    path.resolve(__dirname, "../userlist-alliances.json")
  );
  userlist = JSON.parse(file);

  // Check if this is the first load of the system. If it is, dismiss the check.
  if (!firstsubscription) {

  debug(`latestSubscription updated!`, true);
  debug(newValue.name, true);

    if (checkGifted(newValue)) {
      // Gifted sub!
      givePoints(newValue.sub_plan, newValue, true);
    } else {
      givePoints(newValue.sub_plan, newValue, false);
    }
  } else {
    debug("Extension - First boot; ignoring checks.", true);
    firstsubscription = false;
  }
});

client.on("message", (channel, tags, message, self) => {
  if (self) return;
  if (message.toLowerCase() === "!hello") {
    client.say(channel, `@${tags.username}, greetings! wispWave`);
  }

  if (message.toLowerCase() === "!points") {
    file = fs.readFileSync(
      path.resolve(__dirname, "../userlist-alliances.json")
    );
    userlist = JSON.parse(file);
    if (userlist.hasOwnProperty(tags.username.toLowerCase())) {
      debug(`Found ${tags.username.toLowerCase()} in the list, displaying points!`, false)
      client.say(
        channel,
        `@${tags.username}, you have ${userlist[tags.username]} points!`
      );
    } else {
      debug(`${tags.username.toLowerCase()} not found - no points available`, false);
      client.say(channel, `@${tags.username}, you don't have any points!`);
    }
  }

  switch (message.toLowerCase()) {
    case "#eternalflame":
      updateTeamPoints("eternalflame", tags.username, channel);
      break;
    case "#wintersembrace":
      updateTeamPoints("wintersembrace", tags.username, channel);
      break;
    case "#etherealbloom":
      updateTeamPoints("etherealbloom", tags.username, channel);
      break;
    case "#shadowgrove":
      updateTeamPoints("shadowgrove", tags.username, channel);
      break;
    case "#teamred":
      updateTeamPoints("eternalflame", tags.username, channel);
      break;
    case "#teamyellow":
      updateTeamPoints("eternalflame", tags.username, channel);
      break;
    case "#teampink":
      updateTeamPoints("etherealbloom", tags.username, channel);
      break;
    case "#teamgreen":
      updateTeamPoints("shadowgrove", tags.username, channel);
      break;
    case "#teamorange":
      updateTeamPoints("eternalflame", tags.username, channel);
      break;
    case "#teampurple":
      updateTeamPoints("etherealbloom", tags.username, channel);
      break;
    case "#teamblue":
      updateTeamPoints("wintersembrace", tags.username, channel);
      break;
    case "#teamwhite":
      updateTeamPoints("wintersembrace", tags.username, channel);
      break;
    case "#teamblack":
      updateTeamPoints("shadowgrove", tags.username, channel);
      break;
  }

  if (message.toLowerCase() === "!teamlist") {
    client.say(
      channel,
      `The teams you can spend your points on are: eternalflame, wintersembrace, etherealbloom, shadowgrove. To spend your points, type #<teamname>. (Eg: #eternalflame)`
    );
  }
});

  nodecg.listenFor("enableCounting", (boolean) => {
    if(boolean == true){
      client.connect();
      debug("Counting enabled, connecting client.", true)
    }else{
      client.disconnect();
      debug("Counting disabled, disconnecting client.", true)
    }
  });

  nodecg.listenFor("updateCount", (value, ack) => {
    debug(value, false);
    let newTeamPoints = value["updatedPoints"];
    let selectedTeam = value["selected"];

    // TODO - Check team submitted is valid *before* calculation!
    let teamlist = fs.readFileSync(
      path.resolve(__dirname, "../teamlist-alliances.json")
    );
    let teams = JSON.parse(teamlist);
    teams[selectedTeam] = newTeamPoints;

    const data2 = JSON.stringify(teams, null, 2);
    fs.writeFileSync(
      path.resolve(__dirname, "../teamlist-alliances.json"),
      data2
    );
    teamPoints.value = {
      eternalflame: teams.eternalflame,
      wintersembrace: teams.wintersembrace,
      etherealbloom: teams.etherealbloom,
      shadowgrove: teams.shadowgrove,
    };

    // acknowledgements should always be error-first callbacks.
    // If you do not wish to send an error, use a falsey value
    // like "null" instead.
    if (ack && !ack.handled) {
      ack(null, value * 2);
    }
  });

  nodecg.listenFor("updatePoints", (value, ack) => {
    debug(value, false);
    let event = value["event"];
    let amount = value["val"];
    debug(`Points update received: ${event} - ${amount}`, true);
    switch (event) {
      case "t1":
        t1sub.value = amount;
        debug(t1sub.value, false);
        break;
      case "t2":
        t2sub.value = amount;
        debug(t2sub.value, false);
        break;
      case "t3":
        t3sub.value = amount;
        debug(t3sub.value, false);
        break;
      case "gifted":
        giftedsub.value = amount;
        debug(giftedsub.value, false);
        break;
      case "gifter":
        subgifter.value = amount;
        debug(subgifter.value, false);
        break;
      case "cheer":
        cheer.value = amount;
        debug(cheer.value, false);
        break;
      case "tip":
        tip.value = amount;
        debug(tip.value, false);
        break;
    }

    if (ack && !ack.handled) {
      ack(null, value * 2);
    }
  });
};
