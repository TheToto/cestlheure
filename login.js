require('dotenv').config();
const login = require("facebook-chat-api");
const fs = require("fs");

function generateAppState(callback) {
    console.log("Login with user/pass...")
    login({ email: process.env.USERNAME, password: process.env.PASSWORD }, (err, api) => {
        if (err) return console.error(err);
        console.log("Logged ! Saved to appstate.json");
        fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
        callback(api);
    });
}

function connectAppState(callback) {
    try {
        appstate = JSON.parse(fs.readFileSync('appstate.json', 'utf8'));
    } catch (error) {
        console.log("Failed to load appstate.json...");
        generateAppState((api) => callback(api));
        return;
    }
    console.log("Login with AppState...")
    login({ appState: appstate }, (err, api) => {
        if (err) {
            console.log("Failed to login with appstate.json...");
            generateAppState((api) => callback(api));
            return;
        }
        console.log("Logged !");
        callback(api);
    });
}

module.exports = { generateAppState, connectAppState }
