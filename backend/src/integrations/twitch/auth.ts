import fs from "fs";
import { RefreshingAuthProvider } from "@twurple/auth";
import path from "path";
let authProvider: RefreshingAuthProvider;

export async function init(): Promise<RefreshingAuthProvider> {
  const clientId = process.env.TWITCH_BOT_CLIENT_ID;
  const clientSecret = process.env.TWITCH_BOT_CLIENT_SECRET;
  const tokenData = JSON.parse(
    JSON.stringify(
      fs.readFileSync(path.join(__dirname, "../../../tokens.json"), {
        encoding: "utf-8",
      })
    )
  );
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
  return authProvider;
}