const fs = require("fs");
const path = require("path");
const { debug } = require("../../debug");
let config = fs.readFileSync(path.resolve(__dirname, "../../config.json"));
let opts = JSON.parse(config);
const io = require("socket.io-client");
//Connect to socket
const streamlabs = io(
  `https://sockets.streamlabs.com/?token=${opts["streamlabs"].socket_token}`,
  {
    transports: ["websocket"],
  }
);
/* --------------------------------------------

  STREAMLABS - REGISTER LISTENERS HERE

-------------------------------------------- */
//Perform Action on event
module.exports = function (nodecg) {
  const latestDonation = nodecg.Replicant("latestDonation");
  const latestCheer = nodecg.Replicant("latestCheer");
  const latestSubscription = nodecg.Replicant("latestSubscription");
  streamlabs.on("event", (eventData) => {
    console.log(eventData);
    if (eventData.type === "donation") {
      //code to handle donation events
      debug(eventData.message, false);

      // Reduce characters at end of amount
      if (
        typeof eventData.message[0].amount === "string" ||
        eventData.message[0].amount instanceof String
      ) {
        let amounts = eventData.message[0].amount;
        let newamount = parseInt(amounts.substring(0, amounts.length - 8));
        latestDonation.value = {
          name: eventData.message[0].name,
          amount: newamount,
          currency: eventData.message[0].currency,
        };
      } else {
        latestDonation.value = {
          name: eventData.message[0].name,
          amount: eventData.message[0].amount,
          currency: eventData.message[0].currency,
        };
      }
    }
    if (eventData.for === "twitch_account") {
      switch (eventData.type) {
        case "follow":
          //code to handle follow events
          debug(eventData.message, false);
          break;
        case "subscription":
          //code to handle subscription events
          debug(eventData.message, false);
          latestSubscription.value = {
            name: eventData.message[0].name,
            sub_plan: eventData.message[0].sub_plan,
            months: eventData.message[0].months,
            gifter: eventData.message[0].gifter,
          };
          break;
        case "bits":
          //code to handle donation events
          debug(eventData.message, false);
          latestCheer.value = {
            name: eventData.message[0].name,
            amount: eventData.message[0].amount,
          };

          break;
        default:
          //default case
          debug(eventData.message, false);
      }
    }
  });
};
