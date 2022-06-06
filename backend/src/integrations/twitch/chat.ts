import { ChatClient } from "@twurple/chat";
import { init } from './auth'
import consola from 'consola'
let status: String;
let chatClient
let authProvider;

  
async function createClient() {
  consola.info('Creating Twitch chat client...')
  init().then((provider) => {
    consola.success('Successfully authenticated with Twitch.')
    authProvider = provider
  })
  chatClient = new ChatClient({
    authProvider,
    channels: [process.env.TWITCH_BOT_STREAMER_CHANNEL],
  });
  return chatClient
}

async function connectClient() {
await createClient().then((client) => {
  chatClient = client;
  chatClient.connect()
  chatClient.onConnect(() => {
    status = "Connected";
    consola.success('Twitch chat client successfully connected.')
   });
   
   chatClient.onDisconnect((manually, reason) => {
    if (!manually) {
    } else {
    }
    status = "Disconnected";
   });
   
   chatClient.onMessage((channel, user, message) => {
    if (user == chatClient.currentNick) return;
   
    if (message.toLowerCase() === "!points") {
    }
   
    if (message.toLowerCase() === "!teamlist") {
      chatClient.say(
        channel,
        `The teams you can spend your points on are: eternalflame, wintersembrace, etherealbloom, shadowgrove. To spend your points, type #<teamname>. (Eg: #eternalflame)`
      );
    }
   });
});

}

connectClient()

export = async (io) => {  

  io.on("system:enable-counting", (shouldCount: boolean) => {
    if (shouldCount) {
      chatClient.connect();
    } else {
      chatClient.quit();
    }
  });
}
