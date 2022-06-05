"use strict";

import consola from "consola";
import { Server } from "socket.io";
const io = new Server({});

module.exports = async () => {
  const twitchAuthenticationHandler = require("./integrations/twitch/auth");
  const twitchChatClientHandler = require("./integrations/twitch/chat");
  const streamelementsWebsocketHandler = require("./integrations/streamelements/websocket");
  const pointsHandler = require("./util/points");

  io.on("connection", (socket) => {
    consola.log("New connection established.", socket);
    twitchAuthenticationHandler(io, socket);
    twitchChatClientHandler(io, socket);
    streamelementsWebsocketHandler(io, socket);
    pointsHandler(io, socket);
  });
};

io.listen(3000);
