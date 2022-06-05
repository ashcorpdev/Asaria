
/**
 * TODO: Upgrade to Socket.io v4.x, if possible.
 * TODO: Remove code/listeners for Twitch-specific API/Events and only listen to donations/tips/merch. (streamelements.js => twitch/eventsub.js)
 * TODO: Add support for merch purchases.
 * TODO: Fix debug messages for the streamelements alerts.
 * TODO: Create dummy data json files for streamelements events.
**/

const fs = require("fs");
const path = require("path");
const consola = require('consola');
const io = require("socket.io-client");
const jwt = process.env.STREAMELEMENTS_JWT_TOKEN;
const socket = io("https://realtime.streamelements.com", {
  transports: ["websocket"],
  pingTimeout: 60000,
});

socket.on("connection", (skt) => {
  consola.info(skt.id);
});
socket.on("connect", onConnect);

socket.on("disconnect", (reason) => {
  onDisconnect(reason);
});

socket.on("authenticated", onAuthenticated);

socket.on("unauthorized", console.error);

function onConnect() {
  consola.success("Successfully connected to the streamelements websocket");

  socket.emit("authenticate", { method: "jwt", token: jwt });
}

function onDisconnect(reason) {
  consola.warn("Disconnected from websocket");
  console.warn(reason);

}

function onAuthenticated(data) {
  const { channelId } = data;

  consola.success(`Successfully connected to channel ${channelId}`);
}

socket.on("connect_error", () => {
  socket.connect();
});

socket.on("connect_error", () => {
  setTimeout(() => {
    socket.connect();
  }, 1000);
});

module.exports = function (nodecg) {

  const latestDonation = nodecg.Replicant("latestDonation");
  const latestCheer = nodecg.Replicant("latestCheer");
  const latestSubscription = nodecg.Replicant("latestSubscription");

  socket.on("event", (eventData) => {

    consola.info(eventData);
    if (eventData.type === "tip") {
      consola.info(eventData.data.message, false);
      if (
        typeof eventData.data.amount === "string" ||
        eventData.data.amount instanceof String
      ) {
        let amounts = eventData.data.amount;
        let newamount = parseInt(amounts.substring(0, amounts.length - 8));
        latestDonation.value = {
          name: eventData.data.username,
          amount: newamount,
          currency: eventData.data.userCurrency,
        };
      } else {
        latestDonation.value = {
          name: eventData.data.username,
          amount: eventData.data.amount,
          currency: eventData.data.userCurrency,
        };
      }
    }

    // ! To be removed.
    switch (eventData.type) {
      case "follower":
        consola.info(eventData.data.message, false);
        break;
      case "subscriber":
        consola.info(eventData.data.message, false);
        latestSubscription.value = {
          name: eventData.data.username,
          sub_plan: eventData.data.tier,
          months: eventData.data.amount,
          gifter: eventData.data.sender || "",
        };
        break;
      case "cheer":
        consola.info(eventData.data.message, false);
        latestCheer.value = {
          name: eventData.data.username,
          amount: eventData.data.amount,
        };

        break;
      default:
        consola.info(eventData.data.message, false);
    }
  });
};
