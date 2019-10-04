const db = require('./db');

function getScore() {
    db.connect().then(([dbo, db]) => {
        let test = dbo.collection("messages").aggregate([{
            "$match": {
                'cestlheure': 1
            }
        }, {
            "$group": {
                _id: "$senderID",
                count: {
                    $sum: 1
                }
            }
        }]).toArray((err, arr) => {
            console.log(arr);
            db.close();
        });

    });
}

getScore();