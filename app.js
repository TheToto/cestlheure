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

function isSameMin(d1, d2) {
    return d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear() &&
        d1.getHours() == d2.getHours() &&
        d1.getMinutes() == d2.getMinutes();
}

async function monitoring() {
    let last_heure = new Date(1970, 1, 1, 0, 0, 0, 0);
    action((api) => {
        console.log("Start monitoring !");
        api.listen((err, message) => {
            if (err) return console.error(err);
            if (!message) return console.error("Message is undefined");
            
            console.log(message);

            if (message.threadID == '2175128779192067') {
                let time = new Date(parseInt(message.timestamp));
                if (!isSameMin(last_heure, time) && time.getHours() == time.getMinutes()) {
                    message.cestlheure = 1;
                    last_heure = time;
                    console.log("C'est l'heure !!");
                    api.setMessageReaction(":love:", message.messageID);
                } else {
                    message.cestlheure = 0;
                }
                db.saveMessages([message]);
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

monitoring();
//dump_thread();
//dump_users();
//db.fix_heure();