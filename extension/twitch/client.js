const fs = require("fs");
const path = require("path");
const { debug } = require("../../debug");
let config = fs.readFileSync(path.resolve(__dirname, "../../config.json"));
//let config = require('../../config.json');
let opts = JSON.parse(config);
const username = opts["twitch"].bot_username;
const clientID = opts["twitch"].bot_client_token;
const accessToken = opts["twitch"].bot_oauth_token;
const channel = opts["twitch"].streamer_channel;
const tmi = require("tmi.js");
const node = require("../nodecg").get();
let status;

const client = new tmi.Client({
  options: { debug: false },
  connection: {
    reconnect: true,
    secure: true,
  },
  identity: {
    username: username,
    password: accessToken,
  },
  channels: [channel],
});
client.connect();
const connectionStatusRep = node.Replicant("connectionStatus");
debug(`Twitch client connected to ${channel}.`, true);

client.on("connected", (address, port) => {
  console.log(`Twitch client connected.`);
  status = "Connected";
  connectionStatusRep.value = status;
});

client.on("disconnected", (reason) => {
  console.log(`Twitch client disconnected. Reason: ${reason}`);
  status = "Disconnected";
  connectionStatusRep.value = status;
});

client.on("message", (channel, tags, message, self) => {
  if (self) return;
  if (message.toLowerCase() === "!hello") {
    client.say(channel, `@${tags.username}, greetings! wispWave`);
  }

  if (message.toLowerCase() === "!points") {
    file = fs.readFileSync(
      path.resolve(__dirname, "../../userlist-alliances.json")
    );
    userlist = JSON.parse(file);
    if (userlist.hasOwnProperty(tags.username.toLowerCase())) {
      debug(
        `Found ${tags.username.toLowerCase()} in the list, displaying points!`,
        false
      );
      client.say(
        channel,
        `@${tags.username}, you have ${userlist[tags.username]} points!`
      );
    } else {
      debug(
        `${tags.username.toLowerCase()} not found - no points available`,
        false
      );
      client.say(channel, `@${tags.username}, you don't have any points!`);
    }
  }

  switch (message.toLowerCase()) {
    case "#eternalflame":
      //updateTeamPoints("eternalflame", tags.username, channel);
      node.sendMessage("updateTeamPoints", {
        team: "eternalflame",
        user: tags.username,
        channel,
      });
      break;
    case "#wintersembrace":
      node.sendMessage("updateTeamPoints", {
        team: "wintersembrace",
        user: tags.username,
        channel,
      });
      break;
    case "#etherealbloom":
      node.sendMessage("updateTeamPoints", {
        team: "etherealbloom",
        user: tags.username,
        channel,
      });
      break;
    case "#shadowgrove":
      node.sendMessage("updateTeamPoints", {
        team: "shadowgrove",
        user: tags.username,
        channel,
      });
      break;
    case "#teamred":
      node.sendMessage("updateTeamPoints", {
        team: "eternalflame",
        user: tags.username,
        channel,
      });
      break;
    case "#teamyellow":
      node.sendMessage("updateTeamPoints", {
        team: "eternalflame",
        user: tags.username,
        channel,
      });
      break;
    case "#teampink":
      node.sendMessage("updateTeamPoints", {
        team: "etherealbloom",
        user: tags.username,
        channel,
      });
      break;
    case "#teamgreen":
      node.sendMessage("updateTeamPoints", {
        team: "shadowgrove",
        user: tags.username,
        channel,
      });
      break;
    case "#teamorange":
      node.sendMessage("updateTeamPoints", {
        team: "eternalflame",
        user: tags.username,
        channel,
      });
      break;
    case "#teampurple":
      node.sendMessage("updateTeamPoints", {
        team: "etherealbloom",
        user: tags.username,
        channel,
      });
      break;
    case "#teamblue":
      node.sendMessage("updateTeamPoints", {
        team: "wintersembrace",
        user: tags.username,
        channel,
      });
      break;
    case "#teamwhite":
      node.sendMessage("updateTeamPoints", {
        team: "wintersembrace",
        user: tags.username,
        channel,
      });
      break;
    case "#teamblack":
      node.sendMessage("updateTeamPoints", {
        team: "shadowgrove",
        user: tags.username,
        channel,
      });
      break;
  }

  if (message.toLowerCase() === "!teamlist") {
    client.say(
      channel,
      `The teams you can spend your points on are: eternalflame, wintersembrace, etherealbloom, shadowgrove. To spend your points, type #<teamname>. (Eg: #eternalflame)`
    );
  }
});

module.exports = {
  client,
  status,
  channel,
};
