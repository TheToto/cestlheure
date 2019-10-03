const fb_login = require('./login');
const db = require('./db');

const fs = require('fs');

if (process.env.APPSTATE) {
    fs.writeFileSync("appstate.json", process.env.APPSTATE);
}

async function action(callback) {
    fb_login.connectAppState((api) => {
        api.setOptions({
            selfListen: true,
            logLevel: "silent"
        });
        callback(api);
    });
}

async function monitoring() {
    action((api) => {
        console.log("Start monitoring !");
        api.listen((err, message) => {
            console.log(message);
            db.saveMessages([message]);
            if (message.threadID == '2175128779192067') {
                let date = new Date(parseInt(message.timestamp));
                if (date.getMinutes() == date.getHours()) {
                    console.log("C'est l'heure !!");
                    api.setMessageReaction(":love:", message.messageID, (err) => {
                        if (err) console.error(err)
                    });
                }
            }
        });
    });
}

async function dump_thread() {
    action((api) => {
        db.saveAll(api, undefined);
    });
}

async function info_thread(callback) {
    action((api) => {
        api.getThreadInfo('2175128779192067', function (err, info) {
            if (err) return console.error(err);
            callback(info, api);
        });
    });
}

async function dump_users() {
    info_thread((info, api) => {
        api.getUserInfo(info.participantIDs, (err, ret) => {
            if (err) return console.error(err);
            let list = [];
            for (let user in ret) {
                let obj = ret[user];
                obj._id = user;
                list.push(obj);
            }
            db.dump_participants(list);
        });
    });
}

//monitoring();
//dump_thread();
//dump_users();
db.fix_heure();