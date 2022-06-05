import fs from "fs";
import { RefreshingAuthProvider } from "@twurple/auth";
let authProvider: RefreshingAuthProvider;

function init() {
    
const clientId = process.env.TWITCH_BOT_CLIENT_ID;
const clientSecret = process.env.TWITCH_BOT_CLIENT_SECRET;
const tokenData = JSON.parse(JSON.stringify(fs.readFile("../../../../../tokens.json", { encoding: "utf-8" }, null)));
authProvider = new RefreshingAuthProvider(
  {
    clientId,
    clientSecret,
    onRefresh: async (newTokenData) =>
      fs.writeFile(
        "../../../../../tokens.json",
        JSON.stringify(newTokenData, null, 4),
        null
      ),
  },
  tokenData
);
}

init()

export = authProvider;