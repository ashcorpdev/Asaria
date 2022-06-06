"use strict";

import consola from "consola";
import { Server } from "socket.io";
const io = new Server({});

async function init() {
  consola.info('Asaria Backend starting...')
  const twitchAuthenticationHandler = require("./integrations/twitch/auth");
  const twitchChatClientHandler = require("./integrations/twitch/chat");
  const streamelementsWebsocketHandler = require("./integrations/streamelements/websocket");
  const pointsHandler = require("./util/points");
  const databaseHandler = require('./util/database/database')
  consola.success('Registered handlers successfully!')

  io.on("connection", (socket) => {
    consola.info("New connection established.", socket);
    twitchAuthenticationHandler(io, socket);
    twitchChatClientHandler(io, socket);
    streamelementsWebsocketHandler(io, socket);
    databaseHandler(io, socket);
    pointsHandler(io, socket);

  });
};

init()

io.listen(parseInt(process.env.SOCKET_PORT));
consola.success(`Socket server listening on port ${process.env.SOCKET_PORT}. Awaiting connections...`)