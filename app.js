const login = require("facebook-chat-api");
const fs = require("fs");
const fb_login = require('./login');

async function monitoring() {
    let appstate;
    try {
        appstate = JSON.parse(fs.readFileSync('appstate.json', 'utf8'));
    } catch (error) {
        console.log("Failed to load appstate.json...");
        fb_login.generateAppState(() => monitoring());
        return;
    }
    console.log("Login with appstate.json...");
    login({ appState: appstate }, (err, api) => {
        if (err) {
            console.log("Failed to login with appstate.json...");
            fb_login.generateAppState(() => monitoring());
            return;
        }
        console.log("Start monitoring !");
        api.listen((err, message) => {
            console.log(message);
            if (message.threadID == '2175128779192067') {
                let date = new Date(message.timestamp);
                if (date.getMinutes() == date.getHours()) {
                    api.setMessageReaction(":love:", message.messageID);
                }
            }

            //api.sendMessage(message.body, message.threadID);
        });
    });
}

monitoring();
