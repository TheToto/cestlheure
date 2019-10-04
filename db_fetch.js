const db = require('./db');

async function getGlobalScore(dbo) {
    return new Promise((resolve, reject) => {
        dbo.collection("messages").aggregate([{
            $match: {
                'cestlheure': 1
            }
        }, {
            $group: {
                _id: "$senderID",
                count: {
                    $sum: 1
                }
            }
        }, {
            $lookup: {
                from: "participants",
                localField: "_id",
                foreignField: "_id",
                as: "sender"
            }
        }, {
            $sort: {
                count: -1
            }
        }]).toArray((err, arr) => {
            if (err) return reject(err);
            resolve(arr);
        });
    });
}

async function getUsers(dbo) {
    return new Promise((resolve, reject) => {
        dbo.collection("partitipants").find().toArray((err, arr) => {
            if (err) return reject(err);
            resolve(arr);
        });
    });
}

async function getData(getter) {
    return new Promise((resolve, reject) => {
        db.connect().then(([dbo, db]) => {
            getter(dbo).then((arr) => {
                resolve(arr);
                db.close();
            }).catch(reject);
        }).catch(reject);
    });
}

module.exports = {
    getData,
    getGlobalScore,
    getUsers
};