import fs from "fs";
import path from "path";
import { ChatClient } from "@twurple/chat";
import { init } from './auth'
let status: String;
let chatClient: ChatClient;
let authProvider;

export = (io, socket) => {
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
  
  
  chatClient.onConnect(() => {
    status = "Connected";
  });
  
  chatClient.onDisconnect((manually, reason) => {
    if (!manually) {
    } else {
    }
    status = "Disconnected";
  });
  
  chatClient.onMessage((channel, user, message) => {
    if (self) return;
  
    if (message.toLowerCase() === "!points") {
    }
  
    if (message.toLowerCase() === "!teamlist") {
      chatClient.say(
        channel,
        `The teams you can spend your points on are: eternalflame, wintersembrace, etherealbloom, shadowgrove. To spend your points, type #<teamname>. (Eg: #eternalflame)`
      );
    }
  });

  io.on("system:enable-counting", (shouldCount: boolean) => {
    if (shouldCount) {
      chatClient.connect();
    } else {
      chatClient.quit();
    }
  });
}