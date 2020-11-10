'use strict';

const fs = require('fs');
const path = require('path');
const tmi = require('tmi.js');

let config = fs.readFileSync(path.resolve(__dirname, './config.json'));
let opts = JSON.parse(config);

let userlist = fs.readFileSync(path.resolve(__dirname, './userlist-alliances.json'));
let user = JSON.parse(userlist);

let teamlist = fs.readFileSync(path.resolve(__dirname, './teamlist-alliances.json'));
let teams = JSON.parse(teamlist);

const username = opts['tw_username'];
const clientID = opts['tw_client'];
const accessToken = opts['tw_token'];

const client = new tmi.Client({
	options: { debug: true },
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: username,
		password: accessToken
	},
	channels: ['dawnwhisper']
});
client.connect();

let firstdonation = true;
let firstcheer = true;
let firstsubscription = true;

module.exports = function (nodecg) {


	const latestDonation = nodecg.Replicant('latestDonation', { defaultValue: 123 });
	const latestSubscription = nodecg.Replicant('latestSubscription', { defaultValue: 123 });
	const latestCheer = nodecg.Replicant('latestCheer', { defaultValue: 123 });
	const teamPoints = nodecg.Replicant('teamPoints', { defaultValue: 123 });
	const t1sub = nodecg.Replicant('t1sub', { defaultValue: 5 });
	const t2sub = nodecg.Replicant('t2sub', { defaultValue: 10 });
	const t3sub = nodecg.Replicant('t3sub', { defaultValue: 15 });
	const giftedsub = nodecg.Replicant('giftedsub', { defaultValue: 1 });
	const subgifter = nodecg.Replicant('subgifter', { defaultValue: 1 });
	const tip = nodecg.Replicant('tip', { defaultValue: 1 });
	const cheer = nodecg.Replicant('cheer', { defaultValue: 1 });

	teamPoints.value = { eternalflame: teams.eternalflame, wintersembrace: teams.wintersembrace, etherealbloom: teams.etherealbloom, shadowgrove: teams.shadowgrove };

	teamPoints.on('change', (newValue, oldValue) => {
		console.log(`teamPoints changed from ${oldValue} to ${newValue}`);
		let teamlist = fs.readFileSync(path.resolve(__dirname, './teamlist-alliances.json'));
		let teams = JSON.parse(teamlist);
		console.log(teams);
	});

	latestDonation.on('change', (newValue, oldValue) => {
		console.log(`latestDonation changed from ${oldValue} to ${newValue}`);
		userlist = fs.readFileSync(path.resolve(__dirname, './userlist-alliances.json'));
		user = JSON.parse(userlist);
		//console.log(user);
		//console.log(JSON.stringify(newValue));
		console.log("New donation: " + newValue.name);
		// Checks if the user already exists in the file.
		if (user.hasOwnProperty(newValue.name.toLowerCase())) {
			console.log('User found!');
			if (firstdonation === true) {
				console.log('First load detected - not updating file.');
				firstdonation = false;
			} else {
				//console.log('Not first load, updating file');
				const pointsCalc = newValue.amount * tip.value;
				const initialPoints = user[newValue.name.toLowerCase()];
				console.log(initialPoints);
				const updatedPoints = pointsCalc + initialPoints;
				user[newValue.name.toLowerCase()] = updatedPoints;
				// Formats to human-readable when updating the json file.
				const data = JSON.stringify(user, null, 2);
				fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);
				console.log(updatedPoints);
			}
		} else {
			console.log('User not found!');

			// 5 is equal to number of points per £5 donation.
			const pointsCalc = newValue.amount * tip.value;
			// Rounds the points down to the nearest integer.
			const actualPoints = Math.floor(pointsCalc);
			console.log(actualPoints);
			// Adds the new user and their point value to the object.
			user[newValue.name.toLowerCase()] = actualPoints;
			// Formats to human-readable when updating the json file.
			const data = JSON.stringify(user, null, 2);
			fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);
		}
	});

	latestCheer.on('change', (newValue, oldValue) => {
		console.log(`latestCheer changed from ${oldValue} to ${newValue}`);
		userlist = fs.readFileSync(path.resolve(__dirname, './userlist-alliances.json'));
		user = JSON.parse(userlist);
		console.log(user);
		console.log(JSON.stringify(newValue));
		console.log(newValue.name);
		// Checks if the user already exists in the file.
		if (user.hasOwnProperty(newValue.name.toLowerCase())) {
			console.log('User found!');
			if (firstcheer === true) {
				console.log('First load detected, do not update file!');
				firstcheer = false;
			} else {
				console.log('Not first load, updating file');
				const pointsCalc = newValue.amount / 100 * cheer.value;
				// Rounds the points down to the nearest integer.
				const actualPoints = Math.floor(pointsCalc);
				const initialPoints = user[newValue.name.toLowerCase()];
				console.log(initialPoints);
				const updatedPoints = actualPoints + initialPoints;
				user[newValue.name.toLowerCase()] = updatedPoints;
				// Formats to human-readable when updating the json file.
				const data = JSON.stringify(user, null, 2);
				fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);
				console.log(updatedPoints);
			}
		} else {
			console.log('User not found!');
			// 5 is equal to number of points per £5 donation.
			const pointsCalc = newValue.amount / 100 * cheer.value;
			// Rounds the points down to the nearest integer.
			const actualPoints = Math.floor(pointsCalc);
			console.log(actualPoints);
			// Adds the new user and their point value to the object.
			user[newValue.name.toLowerCase()] = actualPoints;
			// Formats to human-readable when updating the json file.
			const data = JSON.stringify(user, null, 2);
			fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);
		}
	});

	// TODO - Support PRIME Subs
	latestSubscription.on('change', (newValue, oldValue) => {
		console.log(`latestSubscription changed from ${oldValue} to ${newValue}`);
		userlist = fs.readFileSync(path.resolve(__dirname, './userlist-alliances.json'));
		user = JSON.parse(userlist);
		console.log(user);
		console.log(JSON.stringify(newValue));
		console.log(newValue.name);
		// Checks if the user already exists in the file.
		if (user.hasOwnProperty(newValue.name.toLowerCase())) {
			console.log('User found!');
			if (firstsubscription === true) {
				console.log('First load detected, do not update file!');
				firstsubscription = false;
			} else {
				console.log('Not first load, updating file');
				let pointsCalc = t1sub.value;
				let actualPoints = Math.floor(pointsCalc);
				let initialPoints = user[newValue.name.toLowerCase()];
				let updatedPoints = actualPoints + initialPoints;
				let data = JSON.stringify(user, null, 2);
				let gifterName = newValue.gifter;
				switch (newValue.sub_plan) {
					case '1000':
						console.log('Extension - Subscription: tier 1 sub');
						pointsCalc = 1;
						if (gifterName !== '' || gifterName !== null) {
							console.log('Extension - Subscription: gifted sub');
							console.log('Extension - Gifter: ' + newValue.gifter);
							userlist = fs.readFileSync(path.resolve(__dirname, './userlist-alliances.json'));
							user = JSON.parse(userlist);
							if (newValue.gifter !== null) {
								if (user.hasOwnProperty(newValue.gifter.toLowerCase())) {
									// Rounds the points down to the nearest integer.
									actualPoints = Math.floor(subgifter.value);
									initialPoints = user[newValue.gifter.toLowerCase()];
									console.log('Extension - Gifter found in userlist; adding points.');
									updatedPoints = actualPoints + initialPoints;
									user[newValue.gifter.toLowerCase()] = updatedPoints;
									// Formats to human-readable when updating the json file.
									data = JSON.stringify(user, null, 2);
									fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);
									console.log('Extension - New gifter points: ' + updatedPoints);
								} else {
									console.log('Extension - Gifter not found in userlist; adding.')
									user[newValue.gifter.toLowerCase()] = subgifter.value;
									// Formats to human-readable when updating the json file.
									data = JSON.stringify(user, null, 2);
									fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);
									console.log('Extension - New gifter points: '+ subgifter.value);
								}
							}
						} else {
							console.log('Extension - Not gifted');
						}
						// Rounds the points down to the nearest integer.
						actualPoints = Math.floor(pointsCalc * t1sub.value);
						initialPoints = user[newValue.name.toLowerCase()];
						console.log(initialPoints);
						updatedPoints = actualPoints + initialPoints;
						user[newValue.name.toLowerCase()] = updatedPoints;
						// Formats to human-readable when updating the json file.
						data = JSON.stringify(user, null, 2);
						fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);
						console.log(updatedPoints);
						break;
					case 'Prime':
						console.log('Prime sub!');
						pointsCalc = 1;
						if (newValue.gifter !== '' || gifterName !== null) {
							console.log('Gifted sub!');
							console.log(newValue.gifter);
							userlist = fs.readFileSync(path.resolve(__dirname, './userlist-alliances.json'));
							user = JSON.parse(userlist);
							if (newValue.gifter !== null) {

								if (user.hasOwnProperty(newValue.gifter.toLowerCase())) {
									// Rounds the points down to the nearest integer.
									actualPoints = Math.floor(pointsCalc);
									initialPoints = user[newValue.gifter.toLowerCase()];
									console.log(initialPoints);
									updatedPoints = actualPoints + initialPoints;
									user[newValue.gifter.toLowerCase()] = updatedPoints;
									// Formats to human-readable when updating the json file.
									data = JSON.stringify(user, null, 2);
									fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);
									console.log(updatedPoints);
								} else {

								}
							}
						} else {
							user[newValue.gifter.toLowerCase()] = pointsCalc;
							// Formats to human-readable when updating the json file.
							data = JSON.stringify(user, null, 2);
							fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);
							console.log(pointsCalc);
						}
						// Rounds the points down to the nearest integer.
						actualPoints = Math.floor(pointsCalc * 5);
						initialPoints = user[newValue.name.toLowerCase()];
						console.log(initialPoints);
						updatedPoints = actualPoints + initialPoints;
						user[newValue.name.toLowerCase()] = updatedPoints;
						// Formats to human-readable when updating the json file.
						data = JSON.stringify(user, null, 2);
						fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);
						console.log(updatedPoints);
						break;
					case '2000':
						console.log('Tier 2 sub!');
						pointsCalc = 1;
						if (newValue.gifter !== '' || gifterName !== null) {
							console.log('Gifted sub!');
							console.log(newValue.gifter);
							userlist = fs.readFileSync(path.resolve(__dirname, './userlist-alliances.json'));
							user = JSON.parse(userlist);
							if (newValue.gifter !== null) {

								if (user.hasOwnProperty(newValue.gifter.toLowerCase())) {
									// Rounds the points down to the nearest integer.
									actualPoints = Math.floor(pointsCalc);
									initialPoints = user[newValue.gifter.toLowerCase()];
									console.log(initialPoints);
									updatedPoints = actualPoints + initialPoints;
									user[newValue.gifter.toLowerCase()] = updatedPoints;
									// Formats to human-readable when updating the json file.
									data = JSON.stringify(user, null, 2);
									fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);
									console.log(updatedPoints);
								} else {

								}
							}
						} else {
							user[newValue.gifter.toLowerCase()] = pointsCalc;
							// Formats to human-readable when updating the json file.
							data = JSON.stringify(user, null, 2);
							fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);
							console.log(pointsCalc);
						}
						// Rounds the points down to the nearest integer.
						actualPoints = Math.floor(pointsCalc * 5);
						initialPoints = user[newValue.name.toLowerCase()];
						console.log(initialPoints);
						updatedPoints = actualPoints + initialPoints;
						user[newValue.name.toLowerCase()] = updatedPoints;
						// Formats to human-readable when updating the json file.
						data = JSON.stringify(user, null, 2);
						fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);
						console.log(updatedPoints);
						break;
					case '3000':
						console.log('Tier 3 sub!');
						pointsCalc = 1;
						if (newValue.gifter !== '' || gifterName !== null) {
							console.log('Gifted sub!');
							console.log(newValue.gifter);
							userlist = fs.readFileSync(path.resolve(__dirname, './userlist-alliances.json'));
							user = JSON.parse(userlist);
							if (newValue.gifter !== null) {

								if (user.hasOwnProperty(newValue.gifter.toLowerCase())) {
									// Rounds the points down to the nearest integer.
									actualPoints = Math.floor(pointsCalc);
									initialPoints = user[newValue.gifter.toLowerCase()];
									console.log(initialPoints);
									updatedPoints = actualPoints + initialPoints;
									user[newValue.gifter.toLowerCase()] = updatedPoints;
									// Formats to human-readable when updating the json file.
									data = JSON.stringify(user, null, 2);
									fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);
									console.log(updatedPoints);
								} else {
									user[newValue.gifter.toLowerCase()] = pointsCalc;
									// Formats to human-readable when updating the json file.
									data = JSON.stringify(user, null, 2);
									fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);
									console.log(pointsCalc);
								}
							}
						} else {
							console.log('Not gifted');
						}
						// Rounds the points down to the nearest integer.
						actualPoints = Math.floor(pointsCalc * 5);
						initialPoints = user[newValue.name.toLowerCase()];
						console.log(initialPoints);
						updatedPoints = actualPoints + initialPoints;
						user[newValue.name.toLowerCase()] = updatedPoints;
						// Formats to human-readable when updating the json file.
						data = JSON.stringify(user, null, 2);
						fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);
						console.log(updatedPoints);
						break;
					default:
						//default case
						console.log(user);
				}
			}
		} else {
			console.log('User not found');
			let pointsCalc = 1;
			let actualPoints = Math.floor(pointsCalc);
			let initialPoints = user[newValue.name.toLowerCase()];
			let updatedPoints = actualPoints + initialPoints;
			let data = JSON.stringify(user, null, 2);
			let gifterName = newValue.gifter;
			switch (newValue.sub_plan) {
				case '1000':
					console.log('Tier 1 sub!');
					pointsCalc = 1;
					if (!(gifterName == '' || gifterName == null || gifterName == undefined)) {
						console.log('Gifted sub!');
						console.log('Gifter: ' + newValue.gifter);
						userlist = fs.readFileSync(path.resolve(__dirname, './userlist-alliances.json'));
						user = JSON.parse(userlist);
						console.log('Gifter display name: ' + newValue.gifter_display_name);
						if (user.hasOwnProperty(newValue.gifter.toLowerCase())) {
							// Rounds the points down to the nearest integer.
							actualPoints = Math.floor(pointsCalc * 5);
							initialPoints = user[newValue.gifter.toLowerCase()];
							console.log('Gifter previous points: ' + initialPoints);
							updatedPoints = actualPoints + initialPoints;
							console.log('Gifter updated points: ' + updatedPoints);
							user[newValue.gifter.toLowerCase()] = updatedPoints;

							if (user.hasOwnProperty(newValue.name.toLowerCase())) {
								actualPoints = Math.floor(pointsCalc);
								console.log('Giftee points set to: ' + actualPoints);
								initialPoints = user[newValue.name.toLowerCase()];
								console.log('Giftee previous points: ' + initialPoints);
								updatedPoints = actualPoints + initialPoints;
								console.log('Giftee updated points: ' + updatedPoints);
								user[newValue.name.toLowerCase()] = updatedPoints;
							} else {
								user[newValue.name.toLowerCase()] = pointsCalc;
							}

							// Formats to human-readable when updating the json file.
							data = JSON.stringify(user, null, 2);
							fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);
						} else {

							if (user.hasOwnProperty(newValue.name.toLowerCase())) {
								actualPoints = Math.floor(pointsCalc);
								console.log('Giftee points set to: ' + actualPoints);
								initialPoints = user[newValue.name.toLowerCase()];
								console.log('Giftee previous points: ' + initialPoints);
								updatedPoints = actualPoints + initialPoints;
								console.log('Giftee updated points: ' + updatedPoints);
								user[newValue.name.toLowerCase()] = updatedPoints;
							} else {
								user[newValue.name.toLowerCase()] = pointsCalc;
							}
							user[newValue.gifter.toLowerCase()] = pointsCalc * 5;
							console.log('New gifter points: ' + pointsCalc * 5);
							// Formats to human-readable when updating the json file.
							data = JSON.stringify(user, null, 2);
							fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);


						}
					} else {
						console.log('Not gifted');
						actualPoints = Math.floor(pointsCalc * 5);
						user[newValue.name.toLowerCase()] = actualPoints;
						// Formats to human-readable when updating the json file.
						data = JSON.stringify(user, null, 2);
						fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);
						console.log('New subscriber points: ' + pointsCalc * 5);
					}
					break;
				case 'Prime':
					console.log('Prime sub!');
					pointsCalc = 1;
					if (!(gifterName == '' || gifterName == null || gifterName == undefined)) {
						console.log('Gifted sub!');
						console.log('Gifter: ' + newValue.gifter);
						userlist = fs.readFileSync(path.resolve(__dirname, './userlist-alliances.json'));
						user = JSON.parse(userlist);
						console.log('Gifter display name: ' + newValue.gifter_display_name);
						if (user.hasOwnProperty(newValue.gifter.toLowerCase())) {
							// Rounds the points down to the nearest integer.
							actualPoints = Math.floor(pointsCalc * 5);
							initialPoints = user[newValue.gifter.toLowerCase()];
							console.log('Gifter previous points: ' + initialPoints);
							updatedPoints = actualPoints + initialPoints;
							console.log('Gifter updated points: ' + updatedPoints);
							user[newValue.gifter.toLowerCase()] = updatedPoints;

							if (user.hasOwnProperty(newValue.name.toLowerCase())) {
								actualPoints = Math.floor(pointsCalc);
								console.log('Giftee points set to: ' + actualPoints);
								initialPoints = user[newValue.name.toLowerCase()];
								console.log('Giftee previous points: ' + initialPoints);
								updatedPoints = actualPoints + initialPoints;
								console.log('Giftee updated points: ' + updatedPoints);
								user[newValue.name.toLowerCase()] = updatedPoints;
							} else {
								user[newValue.name.toLowerCase()] = pointsCalc;
							}

							// Formats to human-readable when updating the json file.
							data = JSON.stringify(user, null, 2);
							fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);
						} else {

							if (user.hasOwnProperty(newValue.name.toLowerCase())) {
								actualPoints = Math.floor(pointsCalc);
								console.log('Giftee points set to: ' + actualPoints);
								initialPoints = user[newValue.name.toLowerCase()];
								console.log('Giftee previous points: ' + initialPoints);
								updatedPoints = actualPoints + initialPoints;
								console.log('Giftee updated points: ' + updatedPoints);
								user[newValue.name.toLowerCase()] = updatedPoints;
							} else {
								user[newValue.name.toLowerCase()] = pointsCalc;
							}
							user[newValue.gifter.toLowerCase()] = pointsCalc * 5;
							console.log('New gifter points: ' + pointsCalc * 5);
							// Formats to human-readable when updating the json file.
							data = JSON.stringify(user, null, 2);
							fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);


						}
					} else {
						console.log('Not gifted');
						actualPoints = Math.floor(pointsCalc * 5);
						user[newValue.name.toLowerCase()] = actualPoints;
						// Formats to human-readable when updating the json file.
						data = JSON.stringify(user, null, 2);
						fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);
						console.log('New subscriber points: ' + pointsCalc * 5);
					}
					break;
				case '2000':
					console.log('Tier 2 sub!');
					pointsCalc = 1;
					if (!(gifterName == '' || gifterName == null || gifterName == undefined)) {
						console.log('Gifted sub!');
						console.log('Gifter: ' + newValue.gifter);
						userlist = fs.readFileSync(path.resolve(__dirname, './userlist-alliances.json'));
						user = JSON.parse(userlist);
						console.log('Gifter display name: ' + newValue.gifter_display_name);
						if (user.hasOwnProperty(newValue.gifter.toLowerCase())) {
							// Rounds the points down to the nearest integer.
							actualPoints = Math.floor(pointsCalc * 5);
							initialPoints = user[newValue.gifter.toLowerCase()];
							console.log('Gifter previous points: ' + initialPoints);
							updatedPoints = actualPoints + initialPoints;
							console.log('Gifter updated points: ' + updatedPoints);
							user[newValue.gifter.toLowerCase()] = updatedPoints;

							if (user.hasOwnProperty(newValue.name.toLowerCase())) {
								actualPoints = Math.floor(pointsCalc);
								console.log('Giftee points set to: ' + actualPoints);
								initialPoints = user[newValue.name.toLowerCase()];
								console.log('Giftee previous points: ' + initialPoints);
								updatedPoints = actualPoints + initialPoints;
								console.log('Giftee updated points: ' + updatedPoints);
								user[newValue.name.toLowerCase()] = updatedPoints;
							} else {
								user[newValue.name.toLowerCase()] = pointsCalc;
							}

							// Formats to human-readable when updating the json file.
							data = JSON.stringify(user, null, 2);
							fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);
						} else {

							if (user.hasOwnProperty(newValue.name.toLowerCase())) {
								actualPoints = Math.floor(pointsCalc);
								console.log('Giftee points set to: ' + actualPoints);
								initialPoints = user[newValue.name.toLowerCase()];
								console.log('Giftee previous points: ' + initialPoints);
								updatedPoints = actualPoints + initialPoints;
								console.log('Giftee updated points: ' + updatedPoints);
								user[newValue.name.toLowerCase()] = updatedPoints;
							} else {
								user[newValue.name.toLowerCase()] = pointsCalc;
							}
							user[newValue.gifter.toLowerCase()] = pointsCalc * 5;
							console.log('New gifter points: ' + pointsCalc * 5);
							// Formats to human-readable when updating the json file.
							data = JSON.stringify(user, null, 2);
							fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);


						}
					} else {
						console.log('Not gifted');
						actualPoints = Math.floor(pointsCalc * 5);
						user[newValue.name.toLowerCase()] = actualPoints;
						// Formats to human-readable when updating the json file.
						data = JSON.stringify(user, null, 2);
						fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);
						console.log('New subscriber points: ' + pointsCalc * 5);
					}
					break;
				case '3000':
					console.log('Tier 3 sub!');
					pointsCalc = 1;
					if (!(gifterName == '' || gifterName == null || gifterName == undefined)) {
						console.log('Gifted sub!');
						console.log('Gifter: ' + newValue.gifter);
						userlist = fs.readFileSync(path.resolve(__dirname, './userlist-alliances.json'));
						user = JSON.parse(userlist);
						console.log('Gifter display name: ' + newValue.gifter_display_name);
						if (user.hasOwnProperty(newValue.gifter.toLowerCase())) {
							// Rounds the points down to the nearest integer.
							actualPoints = Math.floor(pointsCalc * 5);
							initialPoints = user[newValue.gifter.toLowerCase()];
							console.log('Gifter previous points: ' + initialPoints);
							updatedPoints = actualPoints + initialPoints;
							console.log('Gifter updated points: ' + updatedPoints);
							user[newValue.gifter.toLowerCase()] = updatedPoints;

							if (user.hasOwnProperty(newValue.name.toLowerCase())) {
								actualPoints = Math.floor(pointsCalc);
								console.log('Giftee points set to: ' + actualPoints);
								initialPoints = user[newValue.name.toLowerCase()];
								console.log('Giftee previous points: ' + initialPoints);
								updatedPoints = actualPoints + initialPoints;
								console.log('Giftee updated points: ' + updatedPoints);
								user[newValue.name.toLowerCase()] = updatedPoints;
							} else {
								user[newValue.name.toLowerCase()] = pointsCalc;
							}

							// Formats to human-readable when updating the json file.
							data = JSON.stringify(user, null, 2);
							fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);
						} else {

							if (user.hasOwnProperty(newValue.name.toLowerCase())) {
								actualPoints = Math.floor(pointsCalc);
								console.log('Giftee points set to: ' + actualPoints);
								initialPoints = user[newValue.name.toLowerCase()];
								console.log('Giftee previous points: ' + initialPoints);
								updatedPoints = actualPoints + initialPoints;
								console.log('Giftee updated points: ' + updatedPoints);
								user[newValue.name.toLowerCase()] = updatedPoints;
							} else {
								user[newValue.name.toLowerCase()] = pointsCalc;
							}
							user[newValue.gifter.toLowerCase()] = pointsCalc * 5;
							console.log('New gifter points: ' + pointsCalc * 5);
							// Formats to human-readable when updating the json file.
							data = JSON.stringify(user, null, 2);
							fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);


						}
					} else {
						console.log('Not gifted');
						actualPoints = Math.floor(pointsCalc * 5);
						user[newValue.name.toLowerCase()] = actualPoints;
						// Formats to human-readable when updating the json file.
						data = JSON.stringify(user, null, 2);
						fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data);
						console.log('New subscriber points: ' + pointsCalc * 5);
					}
					break;
				default:
					//default case
					console.log(user);
			}
		}
	});

	client.on('message', (channel, tags, message, self) => {
		if (self) return;
		if (message.toLowerCase() === '!hello') {
			client.say(channel, `@${tags.username}, greetings! wispWave`);
		}

		if (message.toLowerCase() === '!points') {
			userlist = fs.readFileSync(path.resolve(__dirname, './userlist-alliances.json'));
			user = JSON.parse(userlist);
			if (user.hasOwnProperty(tags.username.toLowerCase())) {
				console.log('Found user in the list, displaying points!');
				client.say(channel, `@${tags.username}, you have ${user[tags.username]} points!`);
			} else {
				console.log('No user found, no points available');
				client.say(channel, `@${tags.username}, you don't have any points!`);
			}
		}

		// TODO - Change to switch case with appropriate handling of teams!
		if (message.toLowerCase() === '#eternalflame') {
			updateTeamPoints('eternalflame', tags.username, channel);
		} if (message.toLowerCase() === '#wintersembrace') {
			updateTeamPoints('wintersembrace', tags.username, channel);
		} if (message.toLowerCase() === '#etherealbloom') {
			updateTeamPoints('etherealbloom', tags.username, channel);
		} if (message.toLowerCase() === '#shadowgrove') {
			updateTeamPoints('shadowgrove', tags.username, channel);
		}

		if (message.toLowerCase() === '!teamlist') {
			client.say(channel, `The teams you can spend your points on are: eternalflame, wintersembrace, etherealbloom, shadowgrove. To spend your points, type #<teamname>. (Eg: #eternalflame)`);
		}

	});

	nodecg.listenFor('updateCount', (value, ack) => {
		console.log(value)
		let newTeamPoints = value['updatedPoints'];
		let selectedTeam = value['selected'];

		// TODO - Check team submitted is valid *before* calculation!
		let teamlist = fs.readFileSync(path.resolve(__dirname, './teamlist-alliances.json'));
		let teams = JSON.parse(teamlist);
		teams[selectedTeam] = newTeamPoints;

		const data2 = JSON.stringify(teams, null, 2);
		fs.writeFileSync(path.resolve(__dirname, './teamlist-alliances.json'), data2);
		teamPoints.value = { eternalflame: teams.eternalflame, wintersembrace: teams.wintersembrace, etherealbloom: teams.etherealbloom, shadowgrove: teams.shadowgrove };

		// acknowledgements should always be error-first callbacks.
		// If you do not wish to send an error, use a falsey value
		// like "null" instead.
		if (ack && !ack.handled) {
			ack(null, value * 2);
		}
	});

	nodecg.listenFor('updatePoints', (value, ack) => {
		console.log(value)
		let event = value['event'];
		let amount = value['val'];
		console.log(`Points update received: ${event} - ${amount}`)
		switch (event) {
			case 't1':
				t1sub.value = amount;
				console.log(t1sub.value);
				break;
			case 't2':
				t2sub.value = amount;
				console.log(t2sub.value);
				break;
			case 't3':
				t3sub.value = amount;
				console.log(t3sub.value);
				break;
			case 'gifted':
				giftedsub.value = amount;
				console.log(giftedsub.value);
				break;
			case 'cheer':
				cheer.value = amount;
				console.log(cheer.value);
				break;
			case 'tip':
				tip.value = amount;
				console.log(tip.value);
				break;
		}

		if (ack && !ack.handled) {
			ack(null, value * 2);
		}
	})


	function updateTeamPoints(teamName, username, channel) {
		// TODO - Check team submitted is valid *before* calculation!
		let teamlist = fs.readFileSync(path.resolve(__dirname, './teamlist-alliances.json'));
		let teams = JSON.parse(teamlist);

		userlist = fs.readFileSync(path.resolve(__dirname, './userlist-alliances.json'));
		user = JSON.parse(userlist);
		if (user.hasOwnProperty(username.toLowerCase())) {
			if (user[username] <= 0) {
				client.say(channel, `@${username}, you don't have any points to spend!`);
			} else {
				console.log('Found user in the list, spending points!');
				let oldTeamPoints = teams[teamName];
				let newPoints = oldTeamPoints + user[username];
				console.log('Old points: ' + oldTeamPoints + " New Points: " + newPoints);
				user[username] = 0;
				teams[teamName] = newPoints;
				const data1 = JSON.stringify(user, null, 2);
				fs.writeFileSync(path.resolve(__dirname, './userlist-alliances.json'), data1);

				const data2 = JSON.stringify(teams, null, 2);
				fs.writeFileSync(path.resolve(__dirname, './teamlist-alliances.json'), data2);
				teamPoints.value = { eternalflame: teams.eternalflame, wintersembrace: teams.wintersembrace, etherealbloom: teams.etherealbloom, shadowgrove: teams.shadowgrove };
				client.say(channel, `@${username}, you spent your points on team ${teamName}!`);
			}
		} else {
			console.log('No user found, no points available');
			client.say(channel, `@${username}, you don't have any points to spend!`);
		}
	}
};
