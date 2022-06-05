import fs from "fs";
import { RefreshingAuthProvider } from "@twurple/auth";
import nodecg from "../../util/nodecg";
import path from "path";
require('dotenv').config({ path: '../../../.env' });
let authProvider: RefreshingAuthProvider;

export async function init(): Promise<RefreshingAuthProvider> {
    
const clientId = process.env.TWITCH_BOT_CLIENT_ID;
const clientSecret = process.env.TWITCH_BOT_CLIENT_SECRET;
const tokenData = JSON.parse(JSON.stringify(fs.readFileSync(path.join(__dirname, "../../../tokens.json"), { encoding: 'utf-8'})));
authProvider = new RefreshingAuthProvider(
  {
    clientId,
    clientSecret,
    onRefresh: async (newTokenData) =>
      fs.writeFile(
        path.join(__dirname, "../../../../tokens.json"),
        JSON.stringify(newTokenData, null, 4),
        null
      ),
  },
  tokenData
);
nodecg.get().log.info('Auth provider has been set')
return authProvider
}