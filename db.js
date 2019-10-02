require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

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

function saveMessages(messages) {
    for (let i in messages) {
        messages[i]._id = messages[i].messageID;
    }
    MongoClient.connect(process.env.MONGODB_URI, function (err, db) {
        if (err) throw err;
        let dbo = db.db("heroku_2z8057dw");
        dbo.collection("messages").insertMany(messages, {
            ordered: false
        }, function (err, res) {
            if (err) console.log("dup was found ?");;
            console.log("Inserted !");
            db.close();
        });
    });
}

module.exports = {
    saveAll,
    saveMessages
};