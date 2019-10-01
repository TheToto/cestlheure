const login = require("facebook-chat-api");
require('dotenv').config();
const fs = require("fs");

function generateAppState(callback) {
    console.log("Login with user/pass...")
    login({ email: process.env.USERNAME, password: process.env.PASSWORD }, (err, api) => {
        if (err) return console.error(err);
        console.log("Logged ! Saved to appstate.json");
        fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
        callback();
    });
}

module.exports = { generateAppState }
