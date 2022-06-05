const fs = require("fs");
const path = require("path");
const consola = require('consola');
const node = require("../../util/nodecgecg").get();
let status;
let chatClient;
// TODO: Replace tmi.js with Twurple and re-do Twitch authentication.

import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';

async function createClient() {
  // ----

const clientId = process.env.TWITCH_BOT_CLIENT_ID;
const clientSecret = process.env.TWITCH_BOT_CLIENT_SECRET;
const tokenData = JSON.parse(await fs.readFile('./tokens.json', 'UTF-8'));
const authProvider = new RefreshingAuthProvider(
	{
		clientId,
		clientSecret,
		onRefresh: async newTokenData => await fs.writeFile('./tokens.json', JSON.stringify(newTokenData, null, 4), 'UTF-8')
	},
	tokenData
);
chatClient = new ChatClient({ authProvider, channels: [process.env.TWITCH_STREAMER_CHANNEL] });
chatClient.connect();

// ----
}

createClient()

const connectionStatusRep = node.Replicant("connectionStatus");

consola.info(`Twitch chatClient connected.`, true);

chatClient.on("connected", (address, port) => {
  consola.info(`Twitch chatClient connected.`);
  status = "Connected";
  connectionStatusRep.value = status;
});

chatClient.on("disconnected", (reason) => {
  consola.info(`Twitch chatClient disconnected. Reason: ${reason}`);
  status = "Disconnected";
  connectionStatusRep.value = status;
});

chatClient.on("message", (channel, tags, message, self) => {
  if (self) return;
  if (message.toLowerCase() === "!hello") {
    chatClient.say(channel, `@${tags.username}, greetings! wispWave`);
  }

  if (message.toLowerCase() === "!points") {
    file = fs.readFileSync(
      path.resolve(__dirname, "../../userlist-alliances.json")
    );
    userlist = JSON.parse(file);
    if (userlist.hasOwnProperty(tags.username.toLowerCase())) {
      consola.info(
        `Found ${tags.username.toLowerCase()} in the list, displaying points!`,
        false
      );
      chatClient.say(
        channel,
        `@${tags.username}, you have ${userlist[tags.username]} points!`
      );
    } else {
      consola.info(
        `${tags.username.toLowerCase()} not found - no points available`,
        false
      );
      chatClient.say(channel, `@${tags.username}, you don't have any points!`);
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
