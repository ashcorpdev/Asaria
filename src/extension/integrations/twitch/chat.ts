import fs from "fs";
import path from "path";
const node = require("../../util/nodecg").get();
import { ChatClient } from "@twurple/chat";
import { init } from './auth'
let status: String;
let chatClient: ChatClient;
let authProvider;

async function createClient() {
  init().then((provider) => {
    authProvider = provider
  })
  chatClient = new ChatClient({
    authProvider,
    channels: [process.env.TWITCH_BOT_STREAMER_CHANNEL],
  });
  chatClient.connect();
}

createClient();

const connectionStatusRep = node.Replicant("connectionStatus");

chatClient.onConnect(() => {
  node.log.info(`Twitch chatClient connected.`);
  status = "Connected";
  connectionStatusRep.value = status;
});

chatClient.onDisconnect((manually, reason) => {
  if (!manually) {
    node.log.info(`Twitch chatClient disconnected. Reason: ${reason}`);
  } else {
    node.log.info(`Twitch chatClient disconnected.`);
  }
  status = "Disconnected";
  connectionStatusRep.value = status;
});

chatClient.onMessage((channel, user, message) => {
  if (self) return;
  if (message.toLowerCase() === "!hello") {
    chatClient.say(channel, `@${user}, greetings! wispWave`);
  }

  if (message.toLowerCase() === "!points") {
    let file = fs.readFileSync(
      path.resolve(__dirname, "../../userlist-alliances.json")
    );
    let userlist = JSON.parse(JSON.stringify(file));
    if (userlist.hasOwnProperty(user.toLowerCase())) {
      node.log.info(
        `Found ${user.toLowerCase()} in the list, displaying points!`,
        false
      );
      chatClient.say(channel, `@${user}, you have ${userlist[user]} points!`);
    } else {
      node.log.info(
        `${user.toLowerCase()} not found - no points available`,
        false
      );
      chatClient.say(channel, `@${user}, you don't have any points!`);
    }
  }

  switch (message.toLowerCase()) {
    case "#eternalflame":
      //updateTeamPoints("eternalflame", user, channel);
      node.sendMessage("updateTeamPoints", {
        team: "eternalflame",
        user: user,
        channel,
      });
      break;
    case "#wintersembrace":
      node.sendMessage("updateTeamPoints", {
        team: "wintersembrace",
        user: user,
        channel,
      });
      break;
    case "#etherealbloom":
      node.sendMessage("updateTeamPoints", {
        team: "etherealbloom",
        user: user,
        channel,
      });
      break;
    case "#shadowgrove":
      node.sendMessage("updateTeamPoints", {
        team: "shadowgrove",
        user: user,
        channel,
      });
      break;
    case "#teamred":
      node.sendMessage("updateTeamPoints", {
        team: "eternalflame",
        user: user,
        channel,
      });
      break;
    case "#teamyellow":
      node.sendMessage("updateTeamPoints", {
        team: "eternalflame",
        user: user,
        channel,
      });
      break;
    case "#teampink":
      node.sendMessage("updateTeamPoints", {
        team: "etherealbloom",
        user: user,
        channel,
      });
      break;
    case "#teamgreen":
      node.sendMessage("updateTeamPoints", {
        team: "shadowgrove",
        user: user,
        channel,
      });
      break;
    case "#teamorange":
      node.sendMessage("updateTeamPoints", {
        team: "eternalflame",
        user: user,
        channel,
      });
      break;
    case "#teampurple":
      node.sendMessage("updateTeamPoints", {
        team: "etherealbloom",
        user: user,
        channel,
      });
      break;
    case "#teamblue":
      node.sendMessage("updateTeamPoints", {
        team: "wintersembrace",
        user: user,
        channel,
      });
      break;
    case "#teamwhite":
      node.sendMessage("updateTeamPoints", {
        team: "wintersembrace",
        user: user,
        channel,
      });
      break;
    case "#teamblack":
      node.sendMessage("updateTeamPoints", {
        team: "shadowgrove",
        user: user,
        channel,
      });
      break;
  }

  if (message.toLowerCase() === "!teamlist") {
    chatClient.say(
      channel,
      `The teams you can spend your points on are: eternalflame, wintersembrace, etherealbloom, shadowgrove. To spend your points, type #<teamname>. (Eg: #eternalflame)`
    );
  }
});

module.exports = {
  chatClient,
  status,
};
