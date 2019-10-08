const fb_login = require('./login');
const db = require('./db');

const fs = require('fs');

let save_api = null;

if (process.env.APPSTATE) {
    fs.writeFileSync("appstate.json", process.env.APPSTATE);
}

async function action() {
    return new Promise((resolve, reject) => {
        if (save_api == null) {
            fb_login.connectAppState().then((api) => {
                save_api = api;
                resolve(api);
            }).catch(reject);
        } else {
            resolve(save_api);
        }

    });
}

function isSameMin(d1, d2) {
    return d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear() &&
        d1.getHours() == d2.getHours() &&
        d1.getMinutes() == d2.getMinutes();
}

function monitoring() {
    let last_heure = new Date(1970, 0, 1, 0, 0, 0, 0);
    action().then((api) => {
        console.log("Start monitoring !");
        api.listen((err, message) => {
            if (err) return console.error(err);
            if (!message) return console.error("Message is undefined");
            console.log(message);
            if (message.threadID == '100002143794479') {
                let time = new Date(parseInt(message.timestamp));
                api.setMessageReaction(":love:", message.messageID);
                console.log(time.getHours() + " " + time.getMinutes())
            }
                
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
                db.saveMessages([message]).then(console.log("Inserted new message !"));
            }
            api.markAsRead(message.threadID);
        });
    });
}

async function info_thread() {
    return new Promise((resolve, reject) => {
        action().then((api) => {
            api.getThreadInfo('2175128779192067', function (err, info) {
                if (err) return console.error(err);
                resolve(info);
            });
        }).catch(reject);
    });
}

async function dump_users() {
    return new Promise((resolve, reject) => {
        console.log("Start dumping users");
        info_thread().then((info) => {
            action().then((api) => {
                api.getUserInfo(info.participantIDs, (err, ret) => {
                    if (err) return console.error(err);
                    let list = [];
                    for (let user in ret) {
                        let obj = ret[user];
                        obj._id = user;
                        list.push(obj);
                    }
                    db.dump_participants(list).then(() => {
                        console.log("Dump users done.");
                        resolve();
                    });
                });
            }).catch(reject);
        }).catch(reject);
    });
}

async function dump_thread(timestamp) {
    return new Promise((resolve, reject) => {
        action().then((api) => {
            console.log("Load time : " + timestamp);
            api.getThreadHistory('2175128779192067', 20, timestamp, (err, history) => {
                if (err) return reject(err);

                console.log("Loaded time : " + timestamp);
                if (timestamp != undefined) history.pop();
                if (history.length == 0) return resolve();

                db.saveMessages(history).then(() => console.log("Inserted " + timestamp));

                timestamp = history[0].timestamp.getTime();
                dump_thread(timestamp).then(() => resolve()).catch(reject);
            });
        }).catch(reject);
    });
}

module.exports = {
    dump_users,
    info_thread,
    dump_thread,
    monitoring
}