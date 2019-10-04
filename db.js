require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

async function connect() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (err, db) => {
            if (err) return reject(err);
            let dbo = db.db("heroku_2z8057dw");
            resolve([dbo, db]);
        });
    });
}

function oprations_from_list(list) {
    let operations = [];
    for (let i in list) {
        operations.push({
            updateOne: {
                "filter": {
                    "_id": list[i]._id
                },
                "update": list[i],
                "upsert": true
            }
        });
    }
    return operations;
}

async function saveMessages(messages, archive = false) {
    return new Promise((resolve, reject) => {
        for (let i in messages) {
            messages[i]._id = messages[i].messageID;
            messages[i].archive = archive;
            messages[i].timestamp = parseInt(messages[i].timestamp);
        }
        connect().then(([dbo, db]) => {
            dbo.collection("messages").bulkWrite(oprations_from_list(messages));
            db.close();
            resolve();
        }).catch(error => reject(error));
    });
}

async function dump_participants(id_list) {
    return new Promise((resolve, reject) => {
        connect().then(([dbo, db]) => {
            dbo.collection("participants").bulkWrite(oprations_from_list(id_list));
            db.close();
            resolve();
        }).catch(error => reject(error));
    });

}

function isSameMin(d1, d2) {
    return d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear() &&
        d1.getHours() == d2.getHours() &&
        d1.getMinutes() == d2.getMinutes();
}

async function fix_heure() {
    return new Promise((resolve, reject) => {
        let last_heure = new Date(1970, 1, 1, 0, 0, 0, 0);
        connect().then(([dbo, db]) => {
            dbo.collection("messages").find().sort({
                timestamp: 1
            }).toArray((err, result) => {
                if (err) throw err;
                for (let i in result) {
                    let time = new Date(parseInt(result[i].timestamp));
                    if (!isSameMin(last_heure, time) && time.getHours() == time.getMinutes()) {
                        result[i].cestlheure = 1;
                        last_heure = time;
                    } else {
                        result[i].cestlheure = 0;
                    }
                }
                dbo.collection("messages").bulkWrite(oprations_from_list(result));
                db.close();
                resolve();
            });
        }).catch(error => reject(error));
    });
}

module.exports = {
    connect,
    saveMessages,
    dump_participants,
    fix_heure
};