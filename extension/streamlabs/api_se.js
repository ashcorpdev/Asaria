const fs = require("fs");
const path = require("path");
const { debug } = require("../../debug");
let config = fs.readFileSync(path.resolve(__dirname, "../../config.json"));
const io = require("socket.io-client");
const jwt = config["streamelements"].jwt_token;
const socket = io("https://realtime.streamelements.com", {
  transports: ["websocket"],
  pingTimeout: 60000,
});

socket.on("connection", (skt) => {
  console.log(skt.id);
});
socket.on("connect", onConnect);

// Socket got disconnected
socket.on("disconnect", (reason) => {
  onDisconnect(reason);
});

// Socket is authenticated

socket.on("authenticated", onAuthenticated);

socket.on("unauthorized", console.error);
/* --------------------------------------------

  STREAMELEMENTS - REGISTER LISTENERS HERE

-------------------------------------------- */

function onConnect() {
  console.log("Successfully connected to the streamelements websocket");

  socket.emit("authenticate", { method: "jwt", token: jwt });
}

function onDisconnect(reason) {
  console.log("Disconnected from websocket");
  console.log(reason);

  // Reconnect
}

function onAuthenticated(data) {
  const { channelId } = data;

  console.log(`Successfully connected to channel ${channelId}`);
}

// either by directly modifying the `auth` attribute
socket.on("connect_error", () => {
  socket.connect();
});

socket.on("connect_error", () => {
  setTimeout(() => {
    socket.connect();
  }, 1000);
});

//Perform Action on event
module.exports = function (nodecg) {
  // PRIMARY FUNCTIONALITY

  const latestDonation = nodecg.Replicant("latestDonation");
  const latestCheer = nodecg.Replicant("latestCheer");
  const latestSubscription = nodecg.Replicant("latestSubscription");

  socket.on("event", (eventData) => {
    ///TODO: Handle sub conversions, multi-month subscriptions, merch?
    //		 Fix debug messages for the streamelements alerts.
    //		 Create dummy data json files for streamelements events.

    console.log(eventData);
    if (eventData.type === "tip") {
      //code to handle donation events
      debug(eventData.data.message, false);

      // Reduce characters at end of amount
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

    switch (eventData.type) {
      case "follower":
        //code to handle follow events
        debug(eventData.data.message, false);
        break;
      case "subscriber":
        //code to handle subscription events
        debug(eventData.data.message, false);
        latestSubscription.value = {
          name: eventData.data.username,
          sub_plan: eventData.data.tier,
          months: eventData.data.amount,
          gifter: eventData.data.sender || "",
        };
        break;
      case "cheer":
        //code to handle donation events
        debug(eventData.data.message, false);
        latestCheer.value = {
          name: eventData.data.username,
          amount: eventData.data.amount,
        };

        break;
      default:
        //default case
        debug(eventData.data.message, false);
    }
  });
};
