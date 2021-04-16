/* --------------------------------------------

  NODECG - REGISTER REPLICANTS HERE

-------------------------------------------- */
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

/* --------------------------------------------

  HTML - REGISTER ELEMENTS HERE

-------------------------------------------- */
const addButton = document.getElementById("add-button");
const removeButton = document.getElementById("remove-button");
const enableButton = document.getElementById("enable-button");
const disableButton = document.getElementById("disable-button");
const resetPointsButton = document.getElementById("reset-points-button");
const resetTeamPointsButton = document.getElementById("reset-teams-button");
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

enableButton.disabled = true;
disableButton.disabled = false;

/* --------------------------------------------

  NODECG - REGISTER FUNCTIONS HERE

-------------------------------------------- */
teamPoints.on("change", (newValue, oldValue) => {
  console.log(`teamPoints changed from ${oldValue} to ${newValue}`, true);
  console.log(JSON.stringify(newValue), true);
  var eternalflame = document.getElementById("eternalflame");
  var wintersembrace = document.getElementById("wintersembrace");
  var etherealbloom = document.getElementById("etherealbloom");
  var shadowgrove = document.getElementById("shadowgrove");
  //eternalflame.innerHTML = newValue.eternalflame;
  //wintersembrace.innerHTML = newValue.wintersembrace;
  //etherealbloom.innerHTML = newValue.etherealbloom;
  //shadowgrove.innerHTML = newValue.shadowgrove;
  $(eternalflame).fadeOut("fast", function () {
    eternalflame.innerHTML = newValue.eternalflame;
    $(eternalflame).fadeIn("fast");
  });
  $(wintersembrace).fadeOut("fast", function () {
    wintersembrace.innerHTML = newValue.wintersembrace;
    $(wintersembrace).fadeIn("fast");
  });
  $(etherealbloom).fadeOut("fast", function () {
    etherealbloom.innerHTML = newValue.etherealbloom;
    $(etherealbloom).fadeIn("fast");
  });
  $(shadowgrove).fadeOut("fast", function () {
    shadowgrove.innerHTML = newValue.shadowgrove;
    $(shadowgrove).fadeIn("fast");
  });
});

repT1Sub.on("change", (newValue, oldValue) => {
  console.log(`T1 point value changed.`, false);
  console.log(newValue, false);
  t1Sub.value = newValue;
});

repT2Sub.on("change", (newValue, oldValue) => {
  console.log(`T2 point value changed.`, false);
  console.log(newValue, false);
  t2Sub.value = newValue;
});

repT3Sub.on("change", (newValue, oldValue) => {
  console.log(`T3 point value changed.`, false);
  console.log(newValue, false);
  t3Sub.value = newValue;
});

repGiftedSub.on("change", (newValue, oldValue) => {
  console.log(`Gifted point value changed.`, false);
  console.log(newValue, false);
  giftedSub.value = newValue;
});

repSubGifter.on("change", (newValue, oldValue) => {
  console.log(`Gifted point value changed.`, false);
  console.log(newValue, false);
  subGifter.value = newValue;
});

repCheer.on("change", (newValue, oldValue) => {
  console.log(`Cheer point value changed.`, false);
  console.log(newValue, false);
  cheer.value = newValue;
});

repTip.on("change", (newValue, oldValue) => {
  console.log(`Tip point value changed.`, false);
  console.log(newValue, false);
  tip.value = newValue;
});

latestDonation.on("change", (newValue, oldValue) => {
  console.log(`latestDonation changed from ${oldValue} to ${newValue}`, false);
  console.log(JSON.stringify(newValue), false);
  var donationText = document.getElementById("latestDonation");
  donationText.innerHTML = newValue.name + " donated £" + newValue.amount + ".";
});

latestCheer.on("change", (newValue, oldValue) => {
  console.log(`latestCheer changed from ${oldValue} to ${newValue}`, false);
  console.log(JSON.stringify(newValue), false);
  var cheerText = document.getElementById("latestCheer");
  cheerText.innerHTML =
    newValue.name + " cheered " + newValue.amount + " bits.";
});

latestSubscription.on("change", (newValue, oldValue) => {
  console.log(
    `latestSubscription changed from ${oldValue} to ${newValue}`,
    false
  );
  console.log(JSON.stringify(newValue), false);
  var subscriptionText = document.getElementById("latestSubscription");
  subscriptionText.innerHTML =
    newValue.name + " subscribed for " + newValue.months + " months.";
});

/* --------------------------------------------

  HTML - REGISTER LISTENERS HERE

-------------------------------------------- */

addButton.addEventListener("click", function () {
  updateTeams("add", valueInput.value);
});
removeButton.addEventListener("click", function () {
  updateTeams("remove", valueInput.value);
});

enableButton.addEventListener("click", function () {
  enableCounting(true);
  disableButton.disabled = false;
  enableButton.disabled = true;
});

disableButton.addEventListener("click", function () {
  enableCounting(false);
  enableButton.disabled = false;
  disableButton.disabled = true;
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

/* --------------------------------------------

  HTML - REGISTER FUNCTIONS HERE

-------------------------------------------- */

function updatePointsValue(event) {
  let val = 0;
  switch (event) {
    case "t1":
      console.log("T1 Sub Set button clicked!", false);
      console.log(setT1SubText.value, false);
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
      console.log("Points updated!", false);
    })
    .catch((error) => {
      console.error(error);
    });
}

function enableCounting(boolean) {
  nodecg.sendMessage("enableCounting", boolean);
}

function updateTeams(option, amount) {
  if (teamSelection.value == "choose") {
    console.log("Choose a team!", false);
  } else {
    let selected = teamSelection.value;
    if (option == "add") {
      let currentPoints = Number(document.getElementById(selected).innerText);
      let newPoints =
        parseInt(currentPoints, 10) + parseInt(valueInput.value, 10);
      console.log(parseInt(newPoints, 10), false);
      let updatedPoints = parseInt(newPoints, 10);
      nodecg
        .sendMessage("updateCount", { updatedPoints, selected })
        .then((result) => {
          console.log("Values updated!", false);
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (option == "remove") {
      let currentPoints = Number(document.getElementById(selected).innerText);
      let newPoints =
        parseInt(currentPoints, 10) - parseInt(valueInput.value, 10);
      console.log(parseInt(newPoints, 10), false);
      let updatedPoints = parseInt(newPoints, 10);
      if (updatedPoints <= 0) {
        updatedPoints = 0;
      }
      nodecg
        .sendMessage("updateCount", { updatedPoints, selected })
        .then((result) => {
          console.log("Values updated!", false);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
    }
  }
}
