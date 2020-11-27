const socketToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6IjNGM0ZCRUQyMEQ2N0EwNDEyNzI5IiwicmVhZF9vbmx5Ijp0cnVlLCJwcmV2ZW50X21hc3RlciI6dHJ1ZSwidHdpdGNoX2lkIjoiODg0ODY3NjcifQ.dXCDrfNSi-SF1ZgHIZSc-Z4gq2LTcUqlmiq0hSNW_2w";
//Connect to socket
const streamlabs = io(`https://sockets.streamlabs.com?token=${socketToken}`, {
  transports: ["websocket"],
});

const latestDonation = nodecg.Replicant("latestDonation");
const latestCheer = nodecg.Replicant("latestCheer");
const latestSubscription = nodecg.Replicant("latestSubscription");
const teamPoints = nodecg.Replicant("teamPoints");
const repT1Sub = nodecg.Replicant("t1sub");
const repT2Sub = nodecg.Replicant("t2sub");
const repT3Sub = nodecg.Replicant("t3sub");
const repGiftedSub = nodecg.Replicant("giftedsub");
const repSubGifter = nodecg.Replicant("subgifter");
const repTip = nodecg.Replicant("tip");
const repCheer = nodecg.Replicant("cheer");

const addButton = document.getElementById("add-button");
const removeButton = document.getElementById("remove-button");
const valueInput = document.getElementById("valueInput");
const teamSelection = document.getElementById("teamSelection");
const t1Sub = document.getElementById("t1Sub");
const t2Sub = document.getElementById("t2Sub");
const t3Sub = document.getElementById("t3Sub");
const giftedSub = document.getElementById("giftedSub");
const subGifter = document.getElementById("subGifter");
const cheer = document.getElementById("cheer");
const tip = document.getElementById("tip");
const setT1Sub = document.getElementById("setT1Sub");
const setT2Sub = document.getElementById("setT2Sub");
const setT3Sub = document.getElementById("setT3Sub");
const setGiftedSub = document.getElementById("setGiftedSub");
const setSubGifter = document.getElementById("setSubGifter");
const setCheer = document.getElementById("setCheer");
const setTip = document.getElementById("setTip");
const setT1SubText = document.getElementById("setT1SubText");
const setT2SubText = document.getElementById("setT2SubText");
const setT3SubText = document.getElementById("setT3SubText");
const setGiftedSubText = document.getElementById("setGiftedSubText");
const setSubGifterText = document.getElementById("setSubGifterText");
const setCheerText = document.getElementById("setCheerText");
const setTipText = document.getElementById("setTipText");

teamPoints.on("change", (newValue, oldValue) => {
  console.log(`teamPoints changed from ${oldValue} to ${newValue}`);
  console.log(JSON.stringify(newValue));
  var eternalflame = document.getElementById("eternalflame");
  var wintersembrace = document.getElementById("wintersembrace");
  var etherealbloom = document.getElementById("etherealbloom");
  var shadowgrove = document.getElementById("shadowgrove");
  eternalflame.innerHTML = newValue.eternalflame;
  wintersembrace.innerHTML = newValue.wintersembrace;
  etherealbloom.innerHTML = newValue.etherealbloom;
  shadowgrove.innerHTML = newValue.shadowgrove;
});

repT1Sub.on("change", (newValue, oldValue) => {
  console.log(`T1 point value changed.`);
  console.log(newValue);
  t1Sub.value = newValue;
});

repT2Sub.on("change", (newValue, oldValue) => {
  console.log(`T2 point value changed.`);
  console.log(newValue);
  t2Sub.value = newValue;
});

repT3Sub.on("change", (newValue, oldValue) => {
  console.log(`T3 point value changed.`);
  console.log(newValue);
  t3Sub.value = newValue;
});

repGiftedSub.on("change", (newValue, oldValue) => {
  console.log(`Gifted point value changed.`);
  console.log(newValue);
  giftedSub.value = newValue;
});

repSubGifter.on("change", (newValue, oldValue) => {
  console.log(`Gifted point value changed.`);
  console.log(newValue);
  subGifter.value = newValue;
});

repCheer.on("change", (newValue, oldValue) => {
  console.log(`Cheer point value changed.`);
  console.log(newValue);
  cheer.value = newValue;
});

repTip.on("change", (newValue, oldValue) => {
  console.log(`Tip point value changed.`);
  console.log(newValue);
  tip.value = newValue;
});

latestDonation.on("change", (newValue, oldValue) => {
  console.log(`latestDonation changed from ${oldValue} to ${newValue}`);
  console.log(JSON.stringify(newValue));
  var donationText = document.getElementById("latestDonation");
  donationText.innerHTML = newValue.name + " donated £" + newValue.amount + ".";
});

latestCheer.on("change", (newValue, oldValue) => {
  console.log(`latestCheer changed from ${oldValue} to ${newValue}`);
  console.log(JSON.stringify(newValue));
  var cheerText = document.getElementById("latestCheer");
  cheerText.innerHTML =
    newValue.name + " cheered " + newValue.amount + " bits.";
});

latestSubscription.on("change", (newValue, oldValue) => {
  console.log(`latestSubscription changed from ${oldValue} to ${newValue}`);
  console.log(JSON.stringify(newValue));
  var subscriptionText = document.getElementById("latestSubscription");
  subscriptionText.innerHTML =
    newValue.name + " subscribed for " + newValue.months + " months.";
});
//Perform Action on event
streamlabs.on("event", (eventData) => {
  if (eventData.for === "streamlabs" && eventData.type === "donation") {
    //code to handle donation events
    console.log(eventData.message);
    nodecg.log.info(
      "Donation alert: " + eventData.message[0].name,
      eventData.message[0].amount,
      eventData.message[0].currency
    );

    // Reduce characters at end of amount
    let amounts = eventData.message[0].amount;
    let newamount = amounts.substring(0, amounts.length - 8);
    latestDonation.value = {
      name: eventData.message[0].name,
      amount: newamount,
      currency: eventData.message[0].currency,
    };
  }
  if (eventData.for === "twitch_account") {
    switch (eventData.type) {
      case "follow":
        //code to handle follow events
        console.log(eventData.message);
        break;
      case "subscription":
        //code to handle subscription events
        console.log(eventData.message);
        nodecg.log.info(
          "Subscription alert: " + eventData.message[0].name,
          eventData.message[0].months,
          eventData.message[0].sub_plan
        );
        latestSubscription.value = {
          name: eventData.message[0].name,
          sub_plan: eventData.message[0].sub_plan,
          months: eventData.message[0].months,
          gifter: eventData.message[0].gifter,
        };
        break;
      case "bits":
        //code to handle donation events
        console.log(eventData.message);
        nodecg.log.info(
          "Cheer alert: " + eventData.message[0].name,
          eventData.message[0].amount
        );
        latestCheer.value = {
          name: eventData.message[0].name,
          amount: eventData.message[0].amount,
        };

        break;
      default:
        //default case
        console.log(eventData.message);
    }
  }
});

addButton.addEventListener("click", function () {
  updateTeams("add", valueInput.value);
});
removeButton.addEventListener("click", function () {
  updateTeams("remove", valueInput.value);
});

setT1Sub.addEventListener("click", function () {
  updatePointsValue("t1");
});

setT2Sub.addEventListener("click", function () {
  updatePointsValue("t2");
});

setT3Sub.addEventListener("click", function () {
  updatePointsValue("t3");
});

setGiftedSub.addEventListener("click", function () {
  updatePointsValue("gifted");
});

setSubGifter.addEventListener("click", function () {
  updatePointsValue("gifter");
});

setCheer.addEventListener("click", function () {
  updatePointsValue("cheer");
});

setTip.addEventListener("click", function () {
  updatePointsValue("tip");
});

function updatePointsValue(event) {
  let val = 0;
  switch (event) {
    case "t1":
      console.log("T1 Sub Set button clicked!");
      console.log(setT1SubText.value);
      val = setT1SubText.value;
      break;
    case "t2":
      val = setT2SubText.value;
      break;
    case "t3":
      val = setT3SubText.value;
      break;
    case "gifted":
      val = setGiftedSubText.value;
      break;
    case "gifter":
      val = setSubGifterText.value;
      break;
    case "cheer":
      val = setCheerText.value;
      break;
    case "tip":
      val = setTipText.value;
      break;
  }

  nodecg
    .sendMessage("updatePoints", { event, val })
    .then((result) => {
      console.log("Points updated!");
    })
    .catch((error) => {
      console.error(error);
    });
}

function updateTeams(option, amount) {
  if (teamSelection.value == "choose") {
    console.log("Choose a team!");
  } else {
    let selected = teamSelection.value;
    if (option == "add") {
      let currentPoints = Number(document.getElementById(selected).innerText);
      let newPoints =
        parseInt(currentPoints, 10) + parseInt(valueInput.value, 10);
      console.log(parseInt(newPoints, 10));
      let updatedPoints = parseInt(newPoints, 10);
      nodecg
        .sendMessage("updateCount", { updatedPoints, selected })
        .then((result) => {
          console.log("Values updated!");
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (option == "remove") {
      let currentPoints = Number(document.getElementById(selected).innerText);
      let newPoints =
        parseInt(currentPoints, 10) - parseInt(valueInput.value, 10);
      console.log(parseInt(newPoints, 10));
      let updatedPoints = parseInt(newPoints, 10);
      if (updatedPoints <= 0) {
        updatedPoints = 0;
      }
      nodecg
        .sendMessage("updateCount", { updatedPoints, selected })
        .then((result) => {
          console.log("Values updated!");
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
    }
  }
}
