const mongo = require('mongodb');

function saveAll(api, timestamp){
    api.getThreadHistory(threadID, 50, timestamp, (err, history) => {
        if(err) return console.error(err);
        if (history.length == 0) return console.error("History finished");

        if(timestamp != undefined) history.pop();

        for (let i in history) {
            saveMessage(history[i]);
        }

       nextTimestamp = history[0].timestamp;
       saveAll(api, nextTimestamp);
    });
}

function saveMessage(message) {

}