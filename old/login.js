require('dotenv').config();
const login = require("facebook-chat-api");
const fs = require("fs");
const readline = require("readline");
const otplib = require('otplib');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const options = {
    selfListen: true,
    logLevel: "warn",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64; rv:71.0) Gecko/20100101 Firefox/71.0",
    forceLogin: true
}

async function generateAppState() {
    return new Promise((resolve, reject) => {
        console.log("Login with user/pass...")
        login({
            email: process.env.USERNAME,
            password: process.env.PASSWORD
        }, options, (err, api) => {
            if (err) {
                switch (err.error) {
                    case 'login-approval':
                        const token = otplib.authenticator.generate(process.env.TOTP);
                        err.continue(token)
                        /*
                        console.log('Enter code > ');
                        rl.on('line', (line) => {
                            console.log("code : " + line);
                            err.continue(line);
                            rl.close();
                        });*/
                        break;
                    default:
                        console.error(err);
                        return reject(err);
                }
                return;
            }
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
