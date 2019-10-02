const fb_login = require('./login');

async function monitoring() {
    fb_login.connectAppState((api) => {
        api.setOptions({
            selfListen: true,
            logLevel: "silent"
        });
        console.log("Start monitoring !");
        api.listen((err, message) => {
            console.log(message);
            if (message.threadID == '2175128779192067') {
                let date = new Date(int(message.timestamp));
                if (date.getMinutes() == date.getHours()) {
                    console.log("C'est l'heure !!");
                    api.setMessageReaction(":love:", message.messageID, (err) => { if (err) console.error(err) });
                }
            }
        });
    });
}

monitoring();
