require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

function connect(callback) {
    MongoClient.connect(process.env.MONGODB_URI, function (err, db) {
        if (err) throw err;
        let dbo = db.db("heroku_2z8057dw");
        callback(dbo, function () {
            db.close();
        });
    });
}

function saveAll(api, timestamp) {
    console.log("Load time : " + timestamp);
    api.getThreadHistory('2175128779192067', 20, timestamp, (err, history) => {
        if (err) return console.error(err);

        console.log("Loaded time : " + timestamp);
        if (timestamp != undefined) history.pop();
        if (history.length == 0) return console.error("History finished");

        saveMessages(history);

        nextTimestamp = history[0].timestamp;
        saveAll(api, nextTimestamp);
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

function saveMessages(messages) {
    for (let i in messages) {
        messages[i]._id = messages[i].messageID;
    }
    connect(function (dbo, end) {
        dbo.collection("messages").bulkWrite(oprations_from_list(messages));
        console.log("Inserted !");
        end();
    });
}

async function dump_participants(id_list) {
    connect(function (dbo, end) {
        dbo.collection("participants").bulkWrite(oprations_from_list(id_list));
        console.log("Dump done.");
        end();
    });
}

function isSameMin(d1, d2) {
    return d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear() &&
        d1.getHours() == d2.getHours() &&
        d1.getMinutes() == d2.getMinutes();
}

function dateWithoutSeconds(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), 0, 0);
}

async function dump_heure() {
    let last_heure = new Date(1970, 1, 1, 0, 0, 0, 0);
    let correct_hours = [];
    connect(function (dbo, end) {
        dbo.collection("messages").find().sort({
            timestamp: 1
        }).toArray(function (err, result) {
            if (err) throw err;
            for (let i in result) {
                let time = new Date(parseInt(result[i].timestamp));
                if (!isSameMin(last_heure, time) && time.getHours() == time.getMinutes()) {
                    let obj = result[i];
                    obj._id = dateWithoutSeconds(time);
                    correct_hours.push(obj);
                    last_heure = time;
                }
            }
            dbo.collection("cestlheure").bulkWrite(oprations_from_list(correct_hours));
            console.log("Dump done.");
            end();
        });
    });

}

module.exports = {
    saveAll,
    saveMessages,
    dump_participants,
    dump_heure
};