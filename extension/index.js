"use strict";

/**
 * TODO: Move from a file-based data storage system to a proper database (MongoDB + Mongoose).
 * TODO: Move points calculation to separate utility module.
 * TODO: Implement tests for team valididation *before* calculation.
 * TODO: Add support for prime/community/extended subs.
**/

require('dotenv').config();
const fs = require("fs");
const path = require("path");
const consola = require('consola');
const nodecgApi = require("./util/nodecg");

let config = fs.readFileSync(path.resolve(__dirname, "../config.json"));
let file = fs.readFileSync(
  path.resolve(__dirname, "../userlist-alliances.json")
);
let userlist = JSON.parse(file);
let teamlist = fs.readFileSync(
  path.resolve(__dirname, "../teamlist-alliances.json")
);
let teams = JSON.parse(teamlist);

let firstdonation = true;
let firstcheer = true;
let firstsubscription = true;

module.exports = (nodecg) => {
  nodecgApi.set(nodecg);
  const { client } = require("./integrations/twitch/chat");
  require("./integrations/streamelements/websocket")(nodecg);

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
  const enableCounting = nodecg.Replicant("enableCounting", {
    defaultValue: true,
  });
  const connectionStatus = nodecg.Replicant("connectionStatus", {
    defaultValue: "disconnected",
  });

  teamPoints.value = {
    eternalflame: teams.eternalflame,
    wintersembrace: teams.wintersembrace,
    etherealbloom: teams.etherealbloom,
    shadowgrove: teams.shadowgrove,
  };

  function checkGiftedStatus(newValue) {
    let gifterName = newValue.gifter;
    if (gifterName !== "" && gifterName !== null) {
      consola.info("Gifter: " + gifterName, false);
      return true;
    } else {
      return false;
    }
  }

  function givePointsToUsers(tier, newValue, gifted) {
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
      case "prime":
        points = t1sub.value;
        break;
    }
    if (gifted) {
      if (userlist.hasOwnProperty(newValue.gifter.toLowerCase())) {
        initialPoints = userlist[newValue.gifter.toLowerCase()];
        consola.info("Extension - Gifter found in file; adding points.", true);
        updatedPoints = Math.floor(subgifter.value) + initialPoints;
        userlist[newValue.gifter.toLowerCase()] = updatedPoints;
        data = JSON.stringify(userlist, null, 2);
        fs.writeFileSync(
          path.resolve(__dirname, "../userlist-alliances.json"),
          data
        );
        consola.info("Extension - New gifter points: " + updatedPoints, true);
      } else {
        consola.info("Extension - Gifter not found in file; adding.", true);
        userlist[newValue.gifter.toLowerCase()] = Math.floor(subgifter.value);
        data = JSON.stringify(userlist, null, 2);
        fs.writeFileSync(
          path.resolve(__dirname, "../userlist-alliances.json"),
          data
        );
        consola.info(
          "Extension - New gifter points: " + Math.floor(subgifter.value),
          true
        );
      }

      if (userlist.hasOwnProperty(newValue.name.toLowerCase())) {
        consola.info("Giftee found in file; adding points.", true);
        initialPoints = userlist[newValue.name.toLowerCase()];
        consola.info(initialPoints, false);
        updatedPoints = Math.floor(giftedsub.value) + initialPoints;
        userlist[newValue.name.toLowerCase()] = updatedPoints;
        data = JSON.stringify(userlist, null, 2);
        fs.writeFileSync(
          path.resolve(__dirname, "../userlist-alliances.json"),
          data
        );
        consola.info(updatedPoints, false);
      } else {
        consola.info("Giftee not in file; adding.", true);
        consola.info(newValue.name.toLowerCase(), true);
        userlist[newValue.name.toLowerCase()] = Math.floor(giftedsub.value);
        data = JSON.stringify(userlist, null, 2);
        fs.writeFileSync(
          path.resolve(__dirname, "../userlist-alliances.json"),
          data
        );
        consola.info(updatedPoints, false);
      }
    } else {
      if (userlist.hasOwnProperty(newValue.name.toLowerCase())) {
        initialPoints = userlist[newValue.name.toLowerCase()];
        consola.info(initialPoints, false);
        updatedPoints = Math.floor(points) + initialPoints;
        userlist[newValue.name.toLowerCase()] = updatedPoints;
        data = JSON.stringify(userlist, null, 2);
        fs.writeFileSync(
          path.resolve(__dirname, "../userlist-alliances.json"),
          data
        );
        consola.info(updatedPoints, false);
      } else {
        userlist[newValue.name.toLowerCase()] = Math.floor(points);
        data = JSON.stringify(userlist, null, 2);
        fs.writeFileSync(
          path.resolve(__dirname, "../userlist-alliances.json"),
          data
        );
        consola.info("Extension - new points: " + points, true);
      }
    }
  }

  function updateTeamPoints(teamName, username, channel) {
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
        consola.info(
          `Found ${username.toLowerCase()} in the list, spending ${userPoints} points!`,
          true
        );
        let oldTeamPoints = teams[teamName];
        let newPoints = oldTeamPoints + userlist[username];
        consola.info(
          `Old ${teamName} points: ` +
            oldTeamPoints +
            ` New ${teamName} Points: ` +
            newPoints,
          true
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
      consola.info(`${username.toLowerCase()} not found, no points available`, false);
      client.say(channel, `@${username}, you don't have any points to spend!`);
    }
  }

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
    if (userlist.hasOwnProperty(newValue.name.toLowerCase())) {
      if (firstdonation === true) {
        firstdonation = false;
      } else {
        consola.info(`latestDonation updated!`, true);
        consola.info("New donation: " + newValue.name, true);
        const pointsCalc = newValue.amount * tip.value;
        const initialPoints = userlist[newValue.name.toLowerCase()];
        consola.info(initialPoints, false);
        const updatedPoints = Math.floor(pointsCalc + initialPoints);
        userlist[newValue.name.toLowerCase()] = updatedPoints;
        const data = JSON.stringify(userlist, null, 2);
        fs.writeFileSync(
          path.resolve(__dirname, "../userlist-alliances.json"),
          data
        );
        consola.info(updatedPoints, false);
      }
    } else {
      consola.info("User not found!", false);
      const pointsCalc = newValue.amount * tip.value;
      const actualPoints = Math.floor(pointsCalc);
      consola.info(actualPoints, false);
      userlist[newValue.name.toLowerCase()] = actualPoints;
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
    if (userlist.hasOwnProperty(newValue.name.toLowerCase())) {
      if (firstcheer === true) {
        firstcheer = false;
      } else {
        consola.info(`latestCheer updated!`, true);
        consola.info(`${newValue.name} found!`, true);
        const pointsCalc = (newValue.amount / 100) * cheer.value;
        const actualPoints = Math.floor(pointsCalc);
        const initialPoints = userlist[newValue.name.toLowerCase()];
        const updatedPoints = actualPoints + initialPoints;
        userlist[newValue.name.toLowerCase()] = updatedPoints;
        const data = JSON.stringify(userlist, null, 2);
        fs.writeFileSync(
          path.resolve(__dirname, "../userlist-alliances.json"),
          data
        );
      }
    } else {
      consola.info(`${newValue.name} not found!`, false);
      const pointsCalc = (newValue.amount / 100) * cheer.value;
      const actualPoints = Math.floor(pointsCalc);
      userlist[newValue.name.toLowerCase()] = actualPoints;
      const data = JSON.stringify(userlist, null, 2);
      fs.writeFileSync(
        path.resolve(__dirname, "../userlist-alliances.json"),
        data
      );
    }
  });

  latestSubscription.on("change", (newValue, oldValue) => {
    file = fs.readFileSync(
      path.resolve(__dirname, "../userlist-alliances.json")
    );
    userlist = JSON.parse(file);
    if (!firstsubscription) {
      consola.info(`latestSubscription updated!`, true);
      consola.info(newValue.name, true);

      if (checkGiftedStatus(newValue)) {
        givePointsToUsers(newValue.sub_plan, newValue, true);
      } else {
        givePointsToUsers(newValue.sub_plan, newValue, false);
      }
    } else {
      consola.info("Extension - First boot; ignoring checks.", true);
      firstsubscription = false;
    }
  });

  nodecg.listenFor("enableCounting", (boolean) => {
    if (boolean == true) {
      client.connect();
      consola.info("Counting enabled, connecting client.", true);
    } else {
      client.disconnect();
      consola.info("Counting disabled, disconnecting client.", true);
    }
  });

  nodecg.listenFor("updateCount", (value, ack) => {
    consola.info(value, false);
    let newTeamPoints = value["updatedPoints"];
    let selectedTeam = value["selected"];
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
    if (ack && !ack.handled) {
      ack(null, value * 2);
    }
  });

  nodecg.listenFor("updatePoints", (value, ack) => {
    consola.info(value, false);
    let event = value["event"];
    let amount = value["val"];
    consola.info(`Points update received: ${event} - ${amount}`, true);
    switch (event) {
      case "t1":
        t1sub.value = amount;
        consola.info(t1sub.value, false);
        break;
      case "t2":
        t2sub.value = amount;
        consola.info(t2sub.value, false);
        break;
      case "t3":
        t3sub.value = amount;
        consola.info(t3sub.value, false);
        break;
      case "gifted":
        giftedsub.value = amount;
        consola.info(giftedsub.value, false);
        break;
      case "gifter":
        subgifter.value = amount;
        consola.info(subgifter.value, false);
        break;
      case "cheer":
        cheer.value = amount;
        consola.info(cheer.value, false);
        break;
      case "tip":
        tip.value = amount;
        consola.info(tip.value, false);
        break;
    }

    if (ack && !ack.handled) {
      ack(null, value * 2);
    }
  });

  nodecg.listenFor("updateTeamPoints", (value) => {
    consola.info(value);
    updateTeamPoints(value.team, value.user, value.channel);
  });

  nodecg.listenFor("resetUserPoints", (value) => {
    file = fs.readFileSync(
      path.resolve(__dirname, "../userlist-alliances.json")
    );
    userlist = JSON.parse(file);
    Object.keys(userlist).forEach((v) => (userlist[v] = 0));
    const data = JSON.stringify(userlist, null, 2);
    fs.writeFileSync(
      path.resolve(__dirname, "../userlist-alliances.json"),
      data
    );
  });

  nodecg.listenFor("resetTeamPoints", (value) => {
    file = fs.readFileSync(
      path.resolve(__dirname, "../teamlist-alliances.json")
    );
    teamlist = JSON.parse(file);
    Object.keys(teamlist).forEach((v) => (teamlist[v] = 0));
    const data = JSON.stringify(teamlist, null, 2);
    fs.writeFileSync(
      path.resolve(__dirname, "../teamlist-alliances.json"),
      data
    );

    teamPoints.value = {
      eternalflame: teams.eternalflame,
      wintersembrace: teams.wintersembrace,
      etherealbloom: teams.etherealbloom,
      shadowgrove: teams.shadowgrove,
    };
  });
};
