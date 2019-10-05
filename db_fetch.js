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

async function getMonthScore(dbo, year, month) {
    let curMonth = new Date(year, month, 0, 0, 0, 0, 0);
    let nextMonth = new Date(year, month + 1, 0, 0, 0, 0, 0);
    return new Promise((resolve, reject) => {
        dbo.collection("messages").aggregate([{
            $match: {
                'cestlheure': 1,
                'timestamp': {
                    $gte: curMonth.getTime(),
                    $lt: nextMonth.getTime()
                }
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

async function getCurrentMonthScore(dbo) {
    let date = new Date();
    return getMonthScore(dbo, date.getFullYear(), date.getMonth());
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
            console.log(getter);
            let promises = [];
            for (let get in getter) {
                promises.push(getter[get](dbo));
            }
            Promise.all(promises).then((results) => {
                console.log(results);
                resolve(results);
                db.close();
            }).catch(reject);
        }).catch(reject);
    });
}

module.exports = {
    getData,
    getGlobalScore,
    getUsers,
    getMonthScore,
    getCurrentMonthScore
};