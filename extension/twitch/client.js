const fs = require("fs");
const path = require("path");
const { debug } = require("../../debug")
let config = fs.readFileSync(path.resolve(__dirname, "../../config.json"));
//let config = require('../../config.json');
let opts = JSON.parse(config);
const username = opts["tw_username"];
const clientID = opts["tw_client"];
const accessToken = opts["tw_token"];
const channel = opts["tw_channel"];
const tmi = require("tmi.js");

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
debug(`Twitch client connected to ${channel}.`, true)

module.exports = {
	client
}
