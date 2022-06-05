"use strict";

/**
 * TODO: Move from a file-based data storage system to a proper database (MongoDB + Mongoose).
 * TODO: Move points calculation to separate utility module.
 * TODO: Implement tests for team valididation *before* calculation.
 * TODO: Add support for prime/community/extended subs.
**/

import fs from "fs";
import path from "path";
import nodecgApi from "../../asaria/src/backend/extension/util/nodecg";
import { NodeCG } from "../../../../types/server";

let file = fs.readFileSync(
  path.resolve(__dirname, "../userlist-alliances.json")
);
let userlist = JSON.parse(JSON.stringify(file));
let teamlist = fs.readFileSync(
  path.resolve(__dirname, "../teamlist-alliances.json")
);
let teams = JSON.parse(JSON.stringify(teamlist));

let firstdonation = true;
let firstcheer = true;
let firstsubscription = true;

module.exports = async (nodecg: NodeCG) => {
  nodecg.log.info('Loading Asaria Bundle...')
  nodecgApi.set(nodecg);
  await require('./integrations/twitch/auth')
  const { getChatClient } = require("./integrations/twitch/chat");
  require("./integrations/streamelements/websocket")(nodecg);

  // TODO: Refactor the replicants to have specific default values.
  const latestDonation = nodecg.Replicant("latestDonation", {
    defaultValue: { name: "", amount: 0},
  });
  const latestSubscription = nodecg.Replicant("latestSubscription", {
    defaultValue: { name: "", amount: 0, sub_plan: ""},
  });
  const latestCheer = nodecg.Replicant("latestCheer", { defaultValue: { name: "", amount: 0} });
  const teamPoints = nodecg.Replicant("teamPoints", { defaultValue: { "eternalflame": 0, "wintersembrace": 0, "etherealbloom": 0, "shadowgrove": 0} });
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

  function checkGiftedStatus(eventData: { name?: string; amount?: number; sub_plan?: string; gifter?: any; }) {
    let gifterName = eventData.gifter;
    if (gifterName !== "" && gifterName !== null) {
      nodecg.log.info("Gifter: " + gifterName, false);
      return true;
    } else {
      return false;
    }
  }

  function givePointsToUsers(tier: string, eventData: { name: any; amount?: number; sub_plan?: string; gifter?: any; }, gifted: boolean) {
    let points = 0;
    let initialPoints = 0;
    let updatedPoints = 0;
    let data = JSON.stringify(userlist, null, 2);
    let gifterName = eventData.gifter;
    file = fs.readFileSync(
      path.resolve(__dirname, "../userlist-alliances.json")
    );
    userlist = JSON.parse(JSON.stringify(file));
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
      if (userlist.hasOwnProperty(eventData.gifter.toLowerCase())) {
        initialPoints = userlist[eventData.gifter.toLowerCase()];
        nodecg.log.info("Extension - Gifter found in file; adding points.", true);
        updatedPoints = Math.floor(subgifter.value) + initialPoints;
        userlist[eventData.gifter.toLowerCase()] = updatedPoints;
        data = JSON.stringify(userlist, null, 2);
        fs.writeFileSync(
          path.resolve(__dirname, "../userlist-alliances.json"),
          data
        );
        nodecg.log.info("Extension - New gifter points: " + updatedPoints, true);
      } else {
        nodecg.log.info("Extension - Gifter not found in file; adding.", true);
        userlist[eventData.gifter.toLowerCase()] = Math.floor(subgifter.value);
        data = JSON.stringify(userlist, null, 2);
        fs.writeFileSync(
          path.resolve(__dirname, "../userlist-alliances.json"),
          data
        );
        nodecg.log.info(
          "Extension - New gifter points: " + Math.floor(subgifter.value),
          true
        );
      }

      if (userlist.hasOwnProperty(eventData.name.toLowerCase())) {
        nodecg.log.info("Giftee found in file; adding points.", true);
        initialPoints = userlist[eventData.name.toLowerCase()];
        nodecg.log.info(initialPoints, false);
        updatedPoints = Math.floor(giftedsub.value) + initialPoints;
        userlist[eventData.name.toLowerCase()] = updatedPoints;
        data = JSON.stringify(userlist, null, 2);
        fs.writeFileSync(
          path.resolve(__dirname, "../userlist-alliances.json"),
          data
        );
        nodecg.log.info(updatedPoints, false);
      } else {
        nodecg.log.info("Giftee not in file; adding.", true);
        nodecg.log.info(eventData.name.toLowerCase(), true);
        userlist[eventData.name.toLowerCase()] = Math.floor(giftedsub.value);
        data = JSON.stringify(userlist, null, 2);
        fs.writeFileSync(
          path.resolve(__dirname, "../userlist-alliances.json"),
          data
        );
        nodecg.log.info(updatedPoints, false);
      }
    } else {
      if (userlist.hasOwnProperty(eventData.name.toLowerCase())) {
        initialPoints = userlist[eventData.name.toLowerCase()];
        nodecg.log.info(initialPoints, false);
        updatedPoints = Math.floor(points) + initialPoints;
        userlist[eventData.name.toLowerCase()] = updatedPoints;
        data = JSON.stringify(userlist, null, 2);
        fs.writeFileSync(
          path.resolve(__dirname, "../userlist-alliances.json"),
          data
        );
        nodecg.log.info(updatedPoints, false);
      } else {
        userlist[eventData.name.toLowerCase()] = Math.floor(points);
        data = JSON.stringify(userlist, null, 2);
        fs.writeFileSync(
          path.resolve(__dirname, "../userlist-alliances.json"),
          data
        );
        nodecg.log.info("Extension - new points: " + points, true);
      }
    }
  }

  function updateTeamPoints(teamName: string | number, username: string, channel: any) {
    let teamlist = fs.readFileSync(
      path.resolve(__dirname, "../teamlist-alliances.json")
    );
    let teams = JSON.parse(JSON.stringify(teamlist));

    file = fs.readFileSync(
      path.resolve(__dirname, "../userlist-alliances.json")
    );
    userlist = JSON.parse(JSON.stringify(file));
    if (userlist.hasOwnProperty(username.toLowerCase())) {
      if (userlist[username] <= 0) {
        getChatClient().say(
          channel,
          `@${username}, you don't have any points to spend!`
        );
      } else {
        let userPoints = userlist[username];
        nodecg.log.info(
          `Found ${username.toLowerCase()} in the list, spending ${userPoints} points!`,
          true
        );
        let oldTeamPoints = teams[teamName];
        let newPoints = oldTeamPoints + userlist[username];
        nodecg.log.info(
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
        getChatClient().say(
          channel,
          `@${username}, you spent ${userPoints} points on team ${teamName}!`
        );
      }
    } else {
      nodecg.log.info(`${username.toLowerCase()} not found, no points available`, false);
      getChatClient().say(channel, `@${username}, you don't have any points to spend!`);
    }
  }

  teamPoints.on("change", () => {
    let teamlist = fs.readFileSync(
      path.resolve(__dirname, "../teamlist-alliances.json")
    );
    let teams = JSON.parse(JSON.stringify(teamlist));
  });

  latestDonation.on("change", (eventData) => {
    file = fs.readFileSync(
      path.resolve(__dirname, "../userlist-alliances.json")
    );
    userlist = JSON.parse(JSON.stringify(file));
    if (userlist.hasOwnProperty(eventData.name.toLowerCase())) {
      if (firstdonation === true) {
        firstdonation = false;
      } else {
        nodecg.log.info(`latestDonation updated!`, true);
        nodecg.log.info("New donation: " + eventData.name, true);
        const pointsCalc = eventData.amount * tip.value;
        const initialPoints = userlist[eventData.name.toLowerCase()];
        nodecg.log.info(initialPoints, false);
        const updatedPoints = Math.floor(pointsCalc + initialPoints);
        userlist[eventData.name.toLowerCase()] = updatedPoints;
        const data = JSON.stringify(userlist, null, 2);
        fs.writeFileSync(
          path.resolve(__dirname, "../userlist-alliances.json"),
          data
        );
        nodecg.log.info(updatedPoints, false);
      }
    } else {
      nodecg.log.info("User not found!", false);
      const pointsCalc = eventData.amount * tip.value;
      const actualPoints = Math.floor(pointsCalc);
      nodecg.log.info(actualPoints, false);
      userlist[eventData.name.toLowerCase()] = actualPoints;
      const data = JSON.stringify(userlist, null, 2);
      fs.writeFileSync(
        path.resolve(__dirname, "../userlist-alliances.json"),
        data
      );
    }
  });

  latestCheer.on("change", (eventData, oldValue) => {
    file = fs.readFileSync(
      path.resolve(__dirname, "../userlist-alliances.json")
    );
    userlist = JSON.parse(JSON.stringify(file));
    if (userlist.hasOwnProperty(eventData.name.toLowerCase())) {
      if (firstcheer === true) {
        firstcheer = false;
      } else {
        nodecg.log.info(`latestCheer updated!`, true);
        nodecg.log.info(`${eventData.name} found!`, true);
        const pointsCalc = (eventData.amount / 100) * cheer.value;
        const actualPoints = Math.floor(pointsCalc);
        const initialPoints = userlist[eventData.name.toLowerCase()];
        const updatedPoints = actualPoints + initialPoints;
        userlist[eventData.name.toLowerCase()] = updatedPoints;
        const data = JSON.stringify(userlist, null, 2);
        fs.writeFileSync(
          path.resolve(__dirname, "../userlist-alliances.json"),
          data
        );
      }
    } else {
      nodecg.log.info(`${eventData.name} not found!`, false);
      const pointsCalc = (eventData.amount / 100) * cheer.value;
      const actualPoints = Math.floor(pointsCalc);
      userlist[eventData.name.toLowerCase()] = actualPoints;
      const data = JSON.stringify(userlist, null, 2);
      fs.writeFileSync(
        path.resolve(__dirname, "../userlist-alliances.json"),
        data
      );
    }
  });

  latestSubscription.on("change", (eventData, oldValue) => {
    file = fs.readFileSync(
      path.resolve(__dirname, "../userlist-alliances.json")
    );
    userlist = JSON.parse(JSON.stringify(file));
    if (!firstsubscription) {
      nodecg.log.info(`latestSubscription updated!`, true);
      nodecg.log.info(eventData.name, true);

      if (checkGiftedStatus(eventData)) {
        givePointsToUsers(eventData.sub_plan, eventData, true);
      } else {
        givePointsToUsers(eventData.sub_plan, eventData, false);
      }
    } else {
      nodecg.log.info("Extension - First boot; ignoring checks.", true);
      firstsubscription = false;
    }
  });

  nodecg.listenFor("enableCounting", (boolean) => {
    if (boolean == true) {
      getChatClient().connect();
      nodecg.log.info("Counting enabled, connecting client.");
    } else {
      getChatClient().quit();
      nodecg.log.info("Counting disabled, disconnecting client.");
    }
  });

  nodecg.listenFor("updateCount", (value, ack) => {
    nodecg.log.info(value, false);
    let newTeamPoints = value["updatedPoints"];
    let selectedTeam = value["selected"];
    let teamlist = fs.readFileSync(
      path.resolve(__dirname, "../teamlist-alliances.json")
    );
    let teams = JSON.parse(JSON.stringify(teamlist));
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
  });

  nodecg.listenFor("updatePoints", (value, ack) => {
    nodecg.log.info(value, false);
    let event = value["event"];
    let amount = value["val"];
    nodecg.log.info(`Points update received: ${event} - ${amount}`, true);
    switch (event) {
      case "t1":
        t1sub.value = amount;
        nodecg.log.info(t1sub.value, false);
        break;
      case "t2":
        t2sub.value = amount;
        nodecg.log.info(t2sub.value, false);
        break;
      case "t3":
        t3sub.value = amount;
        nodecg.log.info(t3sub.value, false);
        break;
      case "gifted":
        giftedsub.value = amount;
        nodecg.log.info(giftedsub.value, false);
        break;
      case "gifter":
        subgifter.value = amount;
        nodecg.log.info(subgifter.value, false);
        break;
      case "cheer":
        cheer.value = amount;
        nodecg.log.info(cheer.value, false);
        break;
      case "tip":
        tip.value = amount;
        nodecg.log.info(tip.value, false);
        break;
    }
  });

  nodecg.listenFor("updateTeamPoints", (value) => {
    nodecg.log.info(value);
    updateTeamPoints(value.team, value.user, value.channel);
  });

  nodecg.listenFor("resetUserPoints", (value) => {
    file = fs.readFileSync(
      path.resolve(__dirname, "../userlist-alliances.json")
    );
    userlist = JSON.parse(JSON.stringify(file));
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
    teamlist = JSON.parse(JSON.stringify(file));
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
