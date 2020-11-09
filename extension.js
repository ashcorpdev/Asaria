'use strict';

const fs = require('fs');
const path = require('path');
const tmi = require('tmi.js');

let config = fs.readFileSync(path.resolve(__dirname, './config.json'));
let opts = JSON.parse(config);

let userlist = fs.readFileSync(path.resolve(__dirname, './userlist.json'));
let user = JSON.parse(userlist);

let teamlist = fs.readFileSync(path.resolve(__dirname, './teamlist.json'));
let teams = JSON.parse(teamlist);

const username = opts['tw_username'];
const clientID = opts['tw_client'];
const accessToken = opts['tw_token'];

const client = new tmi.Client({
	options: {debug: true},
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: username,
		password: accessToken
	},
	channels: [ 'dawnwhisper' ]
});
client.connect();

let firstdonation = true;
let firstcheer = true;
let firstsubscription = true;

module.exports = function (nodecg) {


	const latestDonation = nodecg.Replicant('latestDonation', {defaultValue: 123});
	const latestSubscription = nodecg.Replicant('latestSubscription', {defaultValue: 123});
	const latestCheer = nodecg.Replicant('latestCheer', {defaultValue: 123});
	const teamPoints = nodecg.Replicant('teamPoints', {defaultValue: 123});
	const t1sub = nodecg.Replicant('t1sub', {defaultValue: 5});
	const t2sub = nodecg.Replicant('t2sub', {defaultValue: 10});
	const t3sub = nodecg.Replicant('t3sub', {defaultValue: 15});
	const giftedsub = nodecg.Replicant('giftedsub', {defaultValue: 1});

	teamPoints.value = {red: teams.red, yellow: teams.yellow, pink: teams.pink, green: teams.green, orange: teams.orange, purple: teams.purple, blue: teams.blue, white: teams.white, grey: teams.grey, black: teams.black};
	
	teamPoints.on('change', (newValue, oldValue) => {
		console.log(`teamPoints changed from ${oldValue} to ${newValue}`);
		let teamlist = fs.readFileSync(path.resolve(__dirname, './teamlist.json'));
		let teams = JSON.parse(teamlist);
		console.log(teams);
		});

	latestDonation.on('change', (newValue, oldValue) => {
		console.log(`latestDonation changed from ${oldValue} to ${newValue}`);
		userlist = fs.readFileSync(path.resolve(__dirname, './userlist.json'));
		user = JSON.parse(userlist);
		console.log(user);
		console.log(JSON.stringify(newValue));
		console.log(newValue.name);
		// Checks if the user already exists in the file.
		if (user.hasOwnProperty(newValue.name.toLowerCase())) {
			console.log('User found!');
			if (firstdonation === true) {
				console.log('First load detected, do not update file!');
				firstdonation = false;
			} else {
				console.log('Not first load, updating file');
				const pointsCalc = newValue.amount;
				const initialPoints = user[newValue.name.toLowerCase()];
				console.log(initialPoints);
				const updatedPoints = pointsCalc + initialPoints;
				user[newValue.name.toLowerCase()] = updatedPoints;
				// Formats to human-readable when updating the json file.
				const data = JSON.stringify(user, null, 2);
				fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);
				console.log(updatedPoints);
			}
		} else {
			console.log('User not found!');

			// 5 is equal to number of points per £5 donation.
			const pointsCalc = newValue.amount;
			// Rounds the points down to the nearest integer.
			const actualPoints = Math.floor(pointsCalc);
			console.log(actualPoints);
			// Adds the new user and their point value to the object.
			user[newValue.name.toLowerCase()] = actualPoints;
			// Formats to human-readable when updating the json file.
			const data = JSON.stringify(user, null, 2);
			fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);
		}
	});

	latestCheer.on('change', (newValue, oldValue) => {
		console.log(`latestCheer changed from ${oldValue} to ${newValue}`);
		userlist = fs.readFileSync(path.resolve(__dirname, './userlist.json'));
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
				const pointsCalc = newValue.amount / 100;
				// Rounds the points down to the nearest integer.
				const actualPoints = Math.floor(pointsCalc);
				const initialPoints = user[newValue.name.toLowerCase()];
				console.log(initialPoints);
				const updatedPoints = actualPoints + initialPoints;
				user[newValue.name.toLowerCase()] = updatedPoints;
				// Formats to human-readable when updating the json file.
				const data = JSON.stringify(user, null, 2);
				fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);
				console.log(updatedPoints);
			}
		} else {
			console.log('User not found!');
			// 5 is equal to number of points per £5 donation.
			const pointsCalc = newValue.amount / 100;
			// Rounds the points down to the nearest integer.
			const actualPoints = Math.floor(pointsCalc);
			console.log(actualPoints);
			// Adds the new user and their point value to the object.
			user[newValue.name.toLowerCase()] = actualPoints;
			// Formats to human-readable when updating the json file.
			const data = JSON.stringify(user, null, 2);
			fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);
		}
	});

	// TODO - Support PRIME Subs
	latestSubscription.on('change', (newValue, oldValue) => {
		console.log(`latestSubscription changed from ${oldValue} to ${newValue}`);
		userlist = fs.readFileSync(path.resolve(__dirname, './userlist.json'));
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
						if (gifterName !== '' || gifterName !== null) {
							console.log('Gifted sub!');
							console.log(newValue.gifter);
							userlist = fs.readFileSync(path.resolve(__dirname, './userlist.json'));
							user = JSON.parse(userlist);
							if(newValue.gifter !== null){
							if(user.hasOwnProperty(newValue.gifter.toLowerCase())) {
								// Rounds the points down to the nearest integer.
								actualPoints = Math.floor(pointsCalc);
								initialPoints = user[newValue.gifter.toLowerCase()];
								console.log(initialPoints);
								updatedPoints = actualPoints + initialPoints;
								user[newValue.gifter.toLowerCase()] = updatedPoints;
								// Formats to human-readable when updating the json file.
								data = JSON.stringify(user, null, 2);
								fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);
								console.log(updatedPoints);
							} else {
								user[newValue.gifter.toLowerCase()] = pointsCalc;
								// Formats to human-readable when updating the json file.
								data = JSON.stringify(user, null, 2);
								fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);
								console.log(pointsCalc);
							}
							}
						} else {
							console.log('Not gifted');
						}
						// Rounds the points down to the nearest integer.
						actualPoints = Math.floor(pointsCalc*5);
						initialPoints = user[newValue.name.toLowerCase()];
						console.log(initialPoints);
						updatedPoints = actualPoints + initialPoints;
						user[newValue.name.toLowerCase()] = updatedPoints;
						// Formats to human-readable when updating the json file.
						data = JSON.stringify(user, null, 2);
						fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);
						console.log(updatedPoints);
					  break;
					  case 'Prime':
						console.log('Prime sub!');
						pointsCalc = 1;
						if (newValue.gifter !== '' || gifterName !== null) {
							console.log('Gifted sub!');
							console.log(newValue.gifter);
							userlist = fs.readFileSync(path.resolve(__dirname, './userlist.json'));
							user = JSON.parse(userlist);
							if(newValue.gifter !== null){
								
							if(user.hasOwnProperty(newValue.gifter.toLowerCase())) {
								// Rounds the points down to the nearest integer.
								actualPoints = Math.floor(pointsCalc);
								initialPoints = user[newValue.gifter.toLowerCase()];
								console.log(initialPoints);
								updatedPoints = actualPoints + initialPoints;
								user[newValue.gifter.toLowerCase()] = updatedPoints;
								// Formats to human-readable when updating the json file.
								data = JSON.stringify(user, null, 2);
								fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);
								console.log(updatedPoints);
							} else {
								
							}
							}
						} else {
							user[newValue.gifter.toLowerCase()] = pointsCalc;
							// Formats to human-readable when updating the json file.
							data = JSON.stringify(user, null, 2);
							fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);
							console.log(pointsCalc);
						}
						// Rounds the points down to the nearest integer.
						actualPoints = Math.floor(pointsCalc*5);
						initialPoints = user[newValue.name.toLowerCase()];
						console.log(initialPoints);
						updatedPoints = actualPoints + initialPoints;
						user[newValue.name.toLowerCase()] = updatedPoints;
						// Formats to human-readable when updating the json file.
						data = JSON.stringify(user, null, 2);
						fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);
						console.log(updatedPoints);
					  break;
					case '2000':
						console.log('Tier 2 sub!');
						pointsCalc = 1;
						if (newValue.gifter !== '' || gifterName !== null) {
							console.log('Gifted sub!');
							console.log(newValue.gifter);
							userlist = fs.readFileSync(path.resolve(__dirname, './userlist.json'));
							user = JSON.parse(userlist);
							if(newValue.gifter !== null){
								
							if(user.hasOwnProperty(newValue.gifter.toLowerCase())) {
								// Rounds the points down to the nearest integer.
								actualPoints = Math.floor(pointsCalc);
								initialPoints = user[newValue.gifter.toLowerCase()];
								console.log(initialPoints);
								updatedPoints = actualPoints + initialPoints;
								user[newValue.gifter.toLowerCase()] = updatedPoints;
								// Formats to human-readable when updating the json file.
								data = JSON.stringify(user, null, 2);
								fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);
								console.log(updatedPoints);
							} else {
								
							}
							}
						} else {
							user[newValue.gifter.toLowerCase()] = pointsCalc;
							// Formats to human-readable when updating the json file.
							data = JSON.stringify(user, null, 2);
							fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);
							console.log(pointsCalc);
						}
						// Rounds the points down to the nearest integer.
						actualPoints = Math.floor(pointsCalc*5);
						initialPoints = user[newValue.name.toLowerCase()];
						console.log(initialPoints);
						updatedPoints = actualPoints + initialPoints;
						user[newValue.name.toLowerCase()] = updatedPoints;
						// Formats to human-readable when updating the json file.
						data = JSON.stringify(user, null, 2);
						fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);
						console.log(updatedPoints);
					  break;
					case '3000':
						console.log('Tier 3 sub!');
						pointsCalc = 1;
						if (newValue.gifter !== '' || gifterName !== null) {
							console.log('Gifted sub!');
							console.log(newValue.gifter);
							userlist = fs.readFileSync(path.resolve(__dirname, './userlist.json'));
							user = JSON.parse(userlist);
							if(newValue.gifter !== null){
								
							if(user.hasOwnProperty(newValue.gifter.toLowerCase())) {
								// Rounds the points down to the nearest integer.
								actualPoints = Math.floor(pointsCalc);
								initialPoints = user[newValue.gifter.toLowerCase()];
								console.log(initialPoints);
								updatedPoints = actualPoints + initialPoints;
								user[newValue.gifter.toLowerCase()] = updatedPoints;
								// Formats to human-readable when updating the json file.
								data = JSON.stringify(user, null, 2);
								fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);
								console.log(updatedPoints);
							} else {
								user[newValue.gifter.toLowerCase()] = pointsCalc;
								// Formats to human-readable when updating the json file.
								data = JSON.stringify(user, null, 2);
								fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);
								console.log(pointsCalc);
							}
							}
						} else {
							console.log('Not gifted');
						}
						// Rounds the points down to the nearest integer.
						actualPoints = Math.floor(pointsCalc*5);
						initialPoints = user[newValue.name.toLowerCase()];
						console.log(initialPoints);
						updatedPoints = actualPoints + initialPoints;
						user[newValue.name.toLowerCase()] = updatedPoints;
						// Formats to human-readable when updating the json file.
						data = JSON.stringify(user, null, 2);
						fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);
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
			switch(newValue.sub_plan) {
				case '1000':
					console.log('Tier 1 sub!');
					pointsCalc = 1;
					if (!(gifterName == '' || gifterName == null || gifterName == undefined)) {
						console.log('Gifted sub!');
						console.log('Gifter: ' + newValue.gifter);
						userlist = fs.readFileSync(path.resolve(__dirname, './userlist.json'));
						user = JSON.parse(userlist);
							console.log('Gifter display name: ' + newValue.gifter_display_name);
							if(user.hasOwnProperty(newValue.gifter.toLowerCase())) {
								// Rounds the points down to the nearest integer.
								actualPoints = Math.floor(pointsCalc*5);
								initialPoints = user[newValue.gifter.toLowerCase()];
								console.log('Gifter previous points: ' + initialPoints);
								updatedPoints = actualPoints + initialPoints;
								console.log('Gifter updated points: ' + updatedPoints);
								user[newValue.gifter.toLowerCase()] = updatedPoints;
			
								if(user.hasOwnProperty(newValue.name.toLowerCase())){
									actualPoints = Math.floor(pointsCalc);
									console.log('Giftee points set to: ' + actualPoints);
									initialPoints = user[newValue.name.toLowerCase()];
									console.log('Giftee previous points: ' + initialPoints);
									updatedPoints = actualPoints + initialPoints;
									console.log('Giftee updated points: ' + updatedPoints);
									user[newValue.name.toLowerCase()] = updatedPoints;
								}else {
									user[newValue.name.toLowerCase()] = pointsCalc;
								}
			
								// Formats to human-readable when updating the json file.
								data = JSON.stringify(user, null, 2);
								fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);
							} else {

								if(user.hasOwnProperty(newValue.name.toLowerCase())){
									actualPoints = Math.floor(pointsCalc);
									console.log('Giftee points set to: ' + actualPoints);
									initialPoints = user[newValue.name.toLowerCase()];
									console.log('Giftee previous points: ' + initialPoints);
									updatedPoints = actualPoints + initialPoints;
									console.log('Giftee updated points: ' + updatedPoints);
									user[newValue.name.toLowerCase()] = updatedPoints;
								}else {
									user[newValue.name.toLowerCase()] = pointsCalc;
								}
								user[newValue.gifter.toLowerCase()] = pointsCalc*5;
								console.log('New gifter points: ' + pointsCalc*5);
								// Formats to human-readable when updating the json file.
								data = JSON.stringify(user, null, 2);
								fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);

								
							}
						} else {
							console.log('Not gifted');
							actualPoints = Math.floor(pointsCalc*5);
							user[newValue.name.toLowerCase()] = actualPoints;
							// Formats to human-readable when updating the json file.
							data = JSON.stringify(user, null, 2);
							fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);
							console.log('New subscriber points: ' + pointsCalc*5);
						}
				  break;
				  case 'Prime':
					console.log('Prime sub!');
					pointsCalc = 1;
					if (!(gifterName == '' || gifterName == null || gifterName == undefined)) {
						console.log('Gifted sub!');
						console.log('Gifter: ' + newValue.gifter);
						userlist = fs.readFileSync(path.resolve(__dirname, './userlist.json'));
						user = JSON.parse(userlist);
							console.log('Gifter display name: ' + newValue.gifter_display_name);
							if(user.hasOwnProperty(newValue.gifter.toLowerCase())) {
								// Rounds the points down to the nearest integer.
								actualPoints = Math.floor(pointsCalc*5);
								initialPoints = user[newValue.gifter.toLowerCase()];
								console.log('Gifter previous points: ' + initialPoints);
								updatedPoints = actualPoints + initialPoints;
								console.log('Gifter updated points: ' + updatedPoints);
								user[newValue.gifter.toLowerCase()] = updatedPoints;
			
								if(user.hasOwnProperty(newValue.name.toLowerCase())){
									actualPoints = Math.floor(pointsCalc);
									console.log('Giftee points set to: ' + actualPoints);
									initialPoints = user[newValue.name.toLowerCase()];
									console.log('Giftee previous points: ' + initialPoints);
									updatedPoints = actualPoints + initialPoints;
									console.log('Giftee updated points: ' + updatedPoints);
									user[newValue.name.toLowerCase()] = updatedPoints;
								}else {
									user[newValue.name.toLowerCase()] = pointsCalc;
								}
			
								// Formats to human-readable when updating the json file.
								data = JSON.stringify(user, null, 2);
								fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);
							} else {
								
								if(user.hasOwnProperty(newValue.name.toLowerCase())){
									actualPoints = Math.floor(pointsCalc);
									console.log('Giftee points set to: ' + actualPoints);
									initialPoints = user[newValue.name.toLowerCase()];
									console.log('Giftee previous points: ' + initialPoints);
									updatedPoints = actualPoints + initialPoints;
									console.log('Giftee updated points: ' + updatedPoints);
									user[newValue.name.toLowerCase()] = updatedPoints;
								}else {
									user[newValue.name.toLowerCase()] = pointsCalc;
								}
								user[newValue.gifter.toLowerCase()] = pointsCalc*5;
								console.log('New gifter points: ' + pointsCalc*5);
								// Formats to human-readable when updating the json file.
								data = JSON.stringify(user, null, 2);
								fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);

								
							}
						} else {
							console.log('Not gifted');
							actualPoints = Math.floor(pointsCalc*5);
							user[newValue.name.toLowerCase()] = actualPoints;
							// Formats to human-readable when updating the json file.
							data = JSON.stringify(user, null, 2);
							fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);
							console.log('New subscriber points: ' + pointsCalc*5);
						}
				  break;
				case '2000':
					console.log('Tier 2 sub!');
					pointsCalc = 1;
					if (!(gifterName == '' || gifterName == null || gifterName == undefined)) {
						console.log('Gifted sub!');
						console.log('Gifter: ' + newValue.gifter);
						userlist = fs.readFileSync(path.resolve(__dirname, './userlist.json'));
						user = JSON.parse(userlist);
							console.log('Gifter display name: ' + newValue.gifter_display_name);
							if(user.hasOwnProperty(newValue.gifter.toLowerCase())) {
								// Rounds the points down to the nearest integer.
								actualPoints = Math.floor(pointsCalc*5);
								initialPoints = user[newValue.gifter.toLowerCase()];
								console.log('Gifter previous points: ' + initialPoints);
								updatedPoints = actualPoints + initialPoints;
								console.log('Gifter updated points: ' + updatedPoints);
								user[newValue.gifter.toLowerCase()] = updatedPoints;
			
								if(user.hasOwnProperty(newValue.name.toLowerCase())){
									actualPoints = Math.floor(pointsCalc);
									console.log('Giftee points set to: ' + actualPoints);
									initialPoints = user[newValue.name.toLowerCase()];
									console.log('Giftee previous points: ' + initialPoints);
									updatedPoints = actualPoints + initialPoints;
									console.log('Giftee updated points: ' + updatedPoints);
									user[newValue.name.toLowerCase()] = updatedPoints;
								}else {
									user[newValue.name.toLowerCase()] = pointsCalc;
								}
			
								// Formats to human-readable when updating the json file.
								data = JSON.stringify(user, null, 2);
								fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);
							} else {
								
								if(user.hasOwnProperty(newValue.name.toLowerCase())){
									actualPoints = Math.floor(pointsCalc);
									console.log('Giftee points set to: ' + actualPoints);
									initialPoints = user[newValue.name.toLowerCase()];
									console.log('Giftee previous points: ' + initialPoints);
									updatedPoints = actualPoints + initialPoints;
									console.log('Giftee updated points: ' + updatedPoints);
									user[newValue.name.toLowerCase()] = updatedPoints;
								}else {
									user[newValue.name.toLowerCase()] = pointsCalc;
								}
								user[newValue.gifter.toLowerCase()] = pointsCalc*5;
								console.log('New gifter points: ' + pointsCalc*5);
								// Formats to human-readable when updating the json file.
								data = JSON.stringify(user, null, 2);
								fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);

								
							}
						} else {
							console.log('Not gifted');
							actualPoints = Math.floor(pointsCalc*5);
							user[newValue.name.toLowerCase()] = actualPoints;
							// Formats to human-readable when updating the json file.
							data = JSON.stringify(user, null, 2);
							fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);
							console.log('New subscriber points: ' + pointsCalc*5);
						}
				  break;
				case '3000':
					console.log('Tier 3 sub!');
					pointsCalc = 1;
					if (!(gifterName == '' || gifterName == null || gifterName == undefined)) {
						console.log('Gifted sub!');
						console.log('Gifter: ' + newValue.gifter);
						userlist = fs.readFileSync(path.resolve(__dirname, './userlist.json'));
						user = JSON.parse(userlist);
							console.log('Gifter display name: ' + newValue.gifter_display_name);
							if(user.hasOwnProperty(newValue.gifter.toLowerCase())) {
								// Rounds the points down to the nearest integer.
								actualPoints = Math.floor(pointsCalc*5);
								initialPoints = user[newValue.gifter.toLowerCase()];
								console.log('Gifter previous points: ' + initialPoints);
								updatedPoints = actualPoints + initialPoints;
								console.log('Gifter updated points: ' + updatedPoints);
								user[newValue.gifter.toLowerCase()] = updatedPoints;
			
								if(user.hasOwnProperty(newValue.name.toLowerCase())){
									actualPoints = Math.floor(pointsCalc);
									console.log('Giftee points set to: ' + actualPoints);
									initialPoints = user[newValue.name.toLowerCase()];
									console.log('Giftee previous points: ' + initialPoints);
									updatedPoints = actualPoints + initialPoints;
									console.log('Giftee updated points: ' + updatedPoints);
									user[newValue.name.toLowerCase()] = updatedPoints;
								}else {
									user[newValue.name.toLowerCase()] = pointsCalc;
								}
			
								// Formats to human-readable when updating the json file.
								data = JSON.stringify(user, null, 2);
								fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);
							} else {
								
								if(user.hasOwnProperty(newValue.name.toLowerCase())){
									actualPoints = Math.floor(pointsCalc);
									console.log('Giftee points set to: ' + actualPoints);
									initialPoints = user[newValue.name.toLowerCase()];
									console.log('Giftee previous points: ' + initialPoints);
									updatedPoints = actualPoints + initialPoints;
									console.log('Giftee updated points: ' + updatedPoints);
									user[newValue.name.toLowerCase()] = updatedPoints;
								}else {
									user[newValue.name.toLowerCase()] = pointsCalc;
								}
								user[newValue.gifter.toLowerCase()] = pointsCalc*5;
								console.log('New gifter points: ' + pointsCalc*5);
								// Formats to human-readable when updating the json file.
								data = JSON.stringify(user, null, 2);
								fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);

								
							}
						} else {
							console.log('Not gifted');
							actualPoints = Math.floor(pointsCalc*5);
							user[newValue.name.toLowerCase()] = actualPoints;
							// Formats to human-readable when updating the json file.
							data = JSON.stringify(user, null, 2);
							fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);
							console.log('New subscriber points: ' + pointsCalc*5);
						}
				  break;
				default:
				  //default case
				  console.log(user);
			  }
			}
	});

	client.on('message', (channel, tags, message, self) => {
		if(self) return;
		if(message.toLowerCase() === '!hello') {
			client.say(channel, `@${tags.username}, greetings! wispWave`);
		}
		
		if(message.toLowerCase() === '!points') {
		userlist = fs.readFileSync(path.resolve(__dirname, './userlist.json'));
		user = JSON.parse(userlist);
		if(user.hasOwnProperty(tags.username.toLowerCase())){
			console.log('Found user in the list, displaying points!');
			client.say(channel, `@${tags.username}, you have ${user[tags.username]} points!`);
		}else {
			console.log('No user found, no points available');
			client.say(channel, `@${tags.username}, you don't have any points!`);
		}
		}

		// TODO - Change to switch case with appropriate handling of teams!
		if(message.toLowerCase() === '!teamred') {
			updateTeamPoints('red', tags.username, channel);
		}if(message.toLowerCase() === '!teamyellow') {
			updateTeamPoints('yellow', tags.username, channel);
		}if(message.toLowerCase() === '!teampink') {
			updateTeamPoints('pink', tags.username, channel);
		}if(message.toLowerCase() === '!teamgreen') {
			updateTeamPoints('green', tags.username, channel);
		}if(message.toLowerCase() === '!teamorange') {
			updateTeamPoints('orange', tags.username, channel);
		}if(message.toLowerCase() === '!teampurple') {
			updateTeamPoints('purple', tags.username, channel);
		}if(message.toLowerCase() === '!teamblue') {
			updateTeamPoints('blue', tags.username, channel);
		}if(message.toLowerCase() === '!teamwhite') {
			updateTeamPoints('white', tags.username, channel);
		}if(message.toLowerCase() === '!teamgrey') {
			updateTeamPoints('grey', tags.username, channel);
		}if(message.toLowerCase() === '!teamblack') {
			updateTeamPoints('black', tags.username, channel);
		}

		if(message.toLowerCase() === '!teamlist') {
			client.say(channel, `The teams you can spend your points on are: red, yellow, pink, green, orange, purple, blue, white and black. To spend your points, type !team<name>. (Eg: !teamred)`);
		}

	});

		nodecg.listenFor('updateCount', (value, ack) => {
			console.log(value)
			let newTeamPoints = value['updatedPoints'];
			let selectedTeam =  value['selected'];
			
		// TODO - Check team submitted is valid *before* calculation!
		let teamlist = fs.readFileSync(path.resolve(__dirname, './teamlist.json'));
		let teams = JSON.parse(teamlist);
		teams[selectedTeam] = newTeamPoints;
		
		const data2 = JSON.stringify(teams, null, 2);
		fs.writeFileSync(path.resolve(__dirname, './teamlist.json'), data2);
		teamPoints.value = {red: teams.red, yellow: teams.yellow, pink: teams.pink, green: teams.green, orange: teams.orange, purple: teams.purple, blue: teams.blue, white: teams.white, grey: teams.grey, black: teams.black};
		
        // acknowledgements should always be error-first callbacks.
        // If you do not wish to send an error, use a falsey value
        // like "null" instead.
        if (ack && !ack.handled) {
            ack(null, value * 2);
        }
		});


	function updateTeamPoints(teamName, username, channel) {
		// TODO - Check team submitted is valid *before* calculation!
		let teamlist = fs.readFileSync(path.resolve(__dirname, './teamlist.json'));
		let teams = JSON.parse(teamlist);

		userlist = fs.readFileSync(path.resolve(__dirname, './userlist.json'));
		user = JSON.parse(userlist);
		if(user.hasOwnProperty(username.toLowerCase())){
			if(user[username] <= 0){
			client.say(channel, `@${username}, you don't have any points to spend!`);
			}else {
				console.log('Found user in the list, spending points!');
			let oldTeamPoints = teams[teamName];
			let newPoints = oldTeamPoints + user[username];
			console.log('Old points: ' + oldTeamPoints + " New Points: " + newPoints);
			user[username] = 0;
			teams[teamName] = newPoints;
			const data1 = JSON.stringify(user, null, 2);
			fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data1);
			
			const data2 = JSON.stringify(teams, null, 2);
			fs.writeFileSync(path.resolve(__dirname, './teamlist.json'), data2);
			teamPoints.value = {red: teams.red, yellow: teams.yellow, pink: teams.pink, green: teams.green, orange: teams.orange, purple: teams.purple, blue: teams.blue, white: teams.white, grey: teams.grey, black: teams.black};
			client.say(channel, `@${username}, you spent your points on team ${teamName}!`);
			}
		}else {
			console.log('No user found, no points available');
			client.say(channel, `@${username}, you don't have any points to spend!`);
		}
	}
};