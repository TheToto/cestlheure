require('dotenv').config();
const login = require("facebook-chat-api");
const fs = require("fs");

const options = {
    selfListen: true,
    logLevel: "warn",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
    forceLogin: true
}

async function generateAppState() {
    return new Promise((resolve, reject) => {
        console.log("Login with user/pass...")
        login({
            email: process.env.USERNAME,
            password: process.env.PASSWORD
        }, options, (err, api) => {
            if (err) return reject(err);
            console.log("Logged ! Saved to appstate.json");
            fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
            resolve(api);
        });
    });
}

async function connectAppState() {
    return new Promise(async (resolve, reject) => {
        try {
            appstate = JSON.parse(fs.readFileSync('appstate.json', 'utf8'));
        } catch (error) {
            console.log("Failed to load appstate.json...");
            let api = await generateAppState().catch(reject);
            return resolve(api);
        }
        console.log("Login with AppState...")
        login({
            appState: appstate
        }, options, async (err, api) => {
            if (err) {
                console.log("Failed to login with appstate.json...");
                let api = await generateAppState().catch(reject);
                return resolve(api);
            }
            console.log("Logged !");
            resolve(api);
        });
    });
}

module.exports = {
    generateAppState,
    connectAppState
}