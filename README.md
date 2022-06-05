# Asaria


*This project is designed to work as a bundle for the [NodeCG](https://nodecg.dev) broadcast framework for use with OBS to display a point counter system with customisable controls and a number of integrations.*

![](https://i.imgur.com/i8CPaOG.png)

### Features

- Integration with Twitch API for handling various events (such as subscriptions, cheers, and chat messages)
- Integration with Alert system APIs (Streamelements)
- An intuitive dashboard for the streamer to use while broadcasting.
	- This includes controls for enabling counting of points, controlling the values of each event and the ability to quickly add a set amount of points based on a selected team.

### Purpose

_The purpose of this application is to make tracking points for multiple teams simple and easy. It is intended to be an all-in-one solution for events based on this idea. The project was developed specifically for use in [Dawnwhisper](https://twitch.tv/dawnwhisper)'s livestream event known as the 'War of the Wisps', where tournaments and contests are held in order get the community to compete for an 'alliance'. This application allows for users to not only gather points based on various events, such as tips, subs, cheers, but also allows for them to spend them through the Twitch chat using special commands._

If you would like to see the system in action, please check out the VOD from the latest War of the Wisps, available [here](https://www.twitch.tv/videos/1172712992?t=10h31m36s).

## Build Setup (manual)

For this project, you will need to have NodeCG installed. Once you do, you can clone this repo into the `nodecg\bundles\` folder and run NodeCG. The dashboard by default will be available at `localhost:9090`. 

The current branch `develop-2.0` is currently a work-in-progress. If you need to try a fully working version, please use the `main` branch.

## Required setup

In order to use this application, you'll need to have a few files set up.

This project assumes you already have a registered Twitch application and have gathered the appropriate API keys from the streamer.

Some example configs have been provided, which you'll need to copy and remove the `.example` part of the file extension.

`.env` - Holds all of the server environment variables. **Important**: This file needs to be placed in the `nodecg` folder, *not* in the `asaria` folder. This is because NodeCG starts from it's own directory, rather than the bundle directory.

`tokens-twitch.json` - This handles the access/refresh tokens of the twitch application and also holds the scopes for the required application.

`tokens-streamelements.json` - This handles the access/refresh tokens of the streamelements application. This is not currently required by the API when using the JWT token, but it's included just in case.

## Interaction

Viewers of the stream can interact with the application using a set of commands:

`!points` - displays the users's current points
`!teamlist` - displays the names of the current alliances.
`#<alliancename>` - attempts to spend the users' points on the alliance that is named. Available options: *wintersembrace*, *eternalflame*, *shadowgrove*, *etherealbloom*.

## Project Structure
```
asaria
├─ assets
│  ├─ asaria
│  │  └─ shields
│  │     ├─ shields_1.png
│  └─    └─ shields_2.png
├─ dashboard
│  ├─ asaria-alliances.html
│  ├─ asaria-debug.html
│  ├─ css
│  │  └─ mystyles.css
│  ├─ dashboard.css
│  ├─ dialog
│  │  ├─ teampointsreset-dialog.html
│  │  └─ userpointsreset-dialog.html
│  ├─ fonts
│  ├─ js
│  │  └─ alliances.js
│  ├─ panels
│  │  ├─ alliances
│  │  │  ├─ alliances.html
│  │  │  └─ alliances.js
│  │  ├─ alliances-points
│  │  │  ├─ alliances-points.html
│  │  │  └─ alliances-points.js
│  │  ├─ css
│  │  │  └─ panelcss.css
│  │  ├─ manage-points
│  │  │  ├─ manage-points.html
│  │  │  └─ manage-points.js
│  │  ├─ test-alerts
│  │  │  ├─ test-alerts.html
│  │  │  └─ test-alerts.js
│  │  ├─ twitch
│  │  │  ├─ twitch.html
│  │  │  └─ twitch.js
│  │  └─ user-lookup
│  │     ├─ user-lookup.html
│  │     └─ user-lookup.js
│  └─ sass
│     └─ mystyles.scss
├─ extension
│  ├─ controllers
│  │  ├─ core
│  │  │  ├─ core.js
│  │  │  └─ core.ts
│  │  ├─ db
│  │  │  └─ db.js
│  │  ├─ integrations
│  │  │  ├─ api
│  │  │  │  ├─ api.js
│  │  │  │  └─ api.ts
│  │  │  ├─ integrations.js
│  │  │  ├─ integrations.ts
│  │  │  ├─ streamelements
│  │  │  │  └─ se.ts
│  │  │  ├─ streamlabs
│  │  │  │  ├─ sl.js
│  │  │  │  └─ sl.ts
│  │  │  └─ twitch
│  │  │     ├─ client.js
│  │  │     ├─ client.ts
│  │  │     └─ events
│  │  │        ├─ sub.js
│  │  │        └─ sub.ts
│  │  └─ status
│  │     ├─ logging.js
│  │     ├─ logging.ts
│  │     ├─ status.js
│  │     └─ status.ts
│  ├─ index.js
│  └─ index.ts
├─ graphics
│  ├─ index.html
│  ├─ index2.html
│  ├─ shields_1.png
│  └─ shields_2.png
├─ LICENSE
├─ package-lock.json
├─ package.json
└─ README.md
```
