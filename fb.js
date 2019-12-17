const fb_login = require('./login');
const db = require('./db');
const db_fetch = require('./db_fetch');

const CESTLHEURE_THREAD_ID = '2175128779192067';
const BOT_USER_ID = '100041983867506';
const TESTING_THREAD_ID = '100002143794479';

let save_api = null;

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
        api.listenMqtt((err, message) => {
            if (err) return console.error(err);
            if (!message) return console.error("Message is undefined");

	    if (message.type != "message" && message.type != "message_reply")
		return;
            console.log(message);
            api.markAsRead(message.threadID);

            if (message.threadID == CESTLHEURE_THREAD_ID) {
                let time = new Date(parseInt(message.timestamp));
                if (!isSameMin(last_heure, time) && time.getHours() == time.getMinutes()) {
                    message.cestlheure = 1;
                    last_heure = time;
                    console.log("C'est l'heure !!");
                    //api.setMessageReaction(":love:", message.messageID);
                } else {
                    message.cestlheure = 0;
                }
                db.saveMessages([message]).then(console.log("Inserted new message !"));

                if (message.mentions.hasOwnProperty(BOT_USER_ID))
                    api.sendMessage({
                        body: "Classement : https://tinyurl.com/bot-cestlheure/ \nTon évolution : https://tinyurl.com/bot-cestlheure/user/" + message.senderID
                    }, CESTLHEURE_THREAD_ID, message.messageID);
            }
        });
    }).catch((err) => { console.log(err); monitoring(); });
}

async function info_thread() {
    return new Promise((resolve, reject) => {
        action().then((api) => {
            api.getThreadInfo(CESTLHEURE_THREAD_ID, function (err, info) {
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
            api.getThreadHistory(CESTLHEURE_THREAD_ID, 20, timestamp, (err, history) => {
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

async function sendMonthlyReport() {
    let month = new Date().getMonth(); // getMonth = month - 1
    let year = new Date().getFullYear();
    month = month == 0 ? 12 : month;
    year = month == 12 ? year - 1 : year;

    let getPrevMonth = dbo => db_fetch.getMonthScore(dbo, year, month); 
    db_fetch.getData([getPrevMonth]).then(results => {
        let rapport = "";
        let heure_total = 0;
        results = results[0];
        let mentions = [];
        for (let i in results) {
            rapport += `@${results[i].sender[0].name} : ${results[i].count}\n`;
            mentions.push({
                tag: `@${results[i].sender[0].name}`,
                id: results[i].sender[0]._id
            });
            heure_total += results[i].count;
        }
        action().then(api => {
            api.sendMessage({
                body: `Félicitations ! Vous avez obtenu au total ${heure_total} "C'est L'heure" ce mois ci !\n\nRapport du mois :\n${rapport}\n\nClassement détaillé : https://tinyurl.com/bot-cestlheure/?month=${month}&year=${year}`,
                mentions: mentions
            }, CESTLHEURE_THREAD_ID);
        });
    });
}

module.exports = {
    dump_users,
    info_thread,
    dump_thread,
    monitoring,
    sendMonthlyReport
}
