
/**
 * TODO: Upgrade to Socket.io v4.x, if possible.
 * TODO: Remove code/listeners for Twitch-specific API/Events and only listen to donations/tips/merch. (streamelements.js => twitch/eventsub.js)
 * TODO: Add support for merch purchases.
 * TODO: Fix debug messages for the streamelements alerts.
 * TODO: Create dummy data json files for streamelements events.
**/
const io = require("socket.io-client");
import consola from 'consola'

const jwt = process.env.STREAMELEMENTS_JWT_TOKEN;
const seClient = io("https://realtime.streamelements.com", {
  transports: ["websocket"],
  pingTimeout: 60000,
});

seClient.on("connection", (socket) => {
});
seClient.on("connect", onConnect);

seClient.on("disconnect", (reason) => {
  onDisconnect(reason);
});

seClient.on("authenticated", onAuthenticated);

seClient.on("unauthorized", console.error);

function onConnect() {
  seClient.emit("authenticate", { method: "jwt", token: jwt });
}

function onDisconnect(reason) {
  consola.warn(reason);

}

function onAuthenticated(data) {
  const { channelId } = data;
  consola.success('Streamelements client successfully connected and authenticated.')
}

seClient.on("connect_error", () => {
  seClient.connect();
});

seClient.on("connect_error", () => {
  setTimeout(() => {
    seClient.connect();
  }, 1000);
});

export = () => {

  seClient.on("event", (eventData) => {

    if (eventData.type === "tip") {
      if (
        typeof eventData.data.amount === "string" ||
        eventData.data.amount instanceof String
      ) {
        let amounts = eventData.data.amount;
        let newamount = parseInt(amounts.substring(0, amounts.length - 8));
      }
    }
  })
};

export {}