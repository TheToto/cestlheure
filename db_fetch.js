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

async function getScoreByMonth(dbo) {
    return new Promise((resolve, reject) => {
        dbo.collection("messages").aggregate([{
            $match: {
                'cestlheure': 1
            }
        }, { // Group cestlheure by user and month
            $group: {
                _id: {
                    sender: "$senderID",
                    month: {
                        $month: {
                            date: "$timestamp",
                            timezone: "+01"
                        }
                    },
                    year: {
                        $year: {
                            date: "$timestamp",
                            timezone: "+01"
                        }
                    },
                },
                count: {
                    $sum: 1
                }
            }
        }, { // Sort by count
            $sort: {
                count: -1
            }
        }, { // Get the winner of each month (it's sorted by count so it's the first)
            $group: {
                _id: {
                    month: "$_id.month",
                    year: "$_id.year"
                },
                senderID: {
                    $first: "$_id.sender"
                },
            }
        }, { // Group by name and count the nb of win
            $group: {
                _id: "$senderID",
                count: {
                    $sum: 1
                }
            }
        }, { // Sort...
            $sort: {
                count: -1
            }
        }, {
            $lookup: {
                from: "participants",
                localField: "_id",
                foreignField: "_id",
                as: "sender"
            }
        }]).toArray((err, arr) => {
            if (err) return reject(err);
            resolve(arr);
        });
    });
}

async function getChartDataByMonth(dbo) {
    return new Promise((resolve, reject) => {
        dbo.collection("messages").aggregate([{
            $match: {
                'cestlheure': 1
            }
        }, { // Group cestlheure by user and month
            $group: {
                _id: {
                    sender: "$senderID",
                    month: {
                        $month: {
                            date: "$timestamp",
                            timezone: "+01"
                        }
                    },
                    year: {
                        $year: {
                            date: "$timestamp",
                            timezone: "+01"
                        }
                    }
                },
                count: {
                    $sum: 1
                }
            }
        }, {
            $project: {
                _id: "$_id.sender",
                date: {
                    year: "$_id.year",
                    month: "$_id.month"
                },
                count: "$count"
            }
        }, {
            $sort: {
                date: 1
            }
        }, {
            $group: {
                _id: "$_id",
                date: {
                    $push: "$date"
                },
                count: {
                    $push: "$count"
                }
            }
        }, {
            $lookup: {
                from: "participants",
                localField: "_id",
                foreignField: "_id",
                as: "sender"
            }
        }]).toArray((err, arr) => {
            if (err) return reject(err);
            resolve(arr);
        });
    });
}

async function getChartDataCurrentMonth(dbo) {
    let date = new Date();
    let curMonth = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
    let nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1, 0, 0, 0, 0);
    return new Promise((resolve, reject) => {
        dbo.collection("messages").aggregate([{
            $match: {
                'cestlheure': 1,
                'timestamp': {
                    $gte: curMonth,
                    $lt: nextMonth
                }
            }
        }, { // Group cestlheure by user and day
            $group: {
                _id: {
                    sender: "$senderID",
                    day: {
                        $dayOfMonth: {
                            date: "$timestamp",
                            timezone: "+01"
                        }
                    }
                },
                count: {
                    $sum: 1
                }
            }
        }, {
            $project: {
                _id: "$_id.sender",
                day: "$_id.day",
                count: "$count"
            }
        }, {
            $sort: {
                day: 1
            }
        }, {
            $group: {
                _id: "$_id",
                day: {
                    $push: "$day"
                },
                count: {
                    $push: "$count"
                }
            }
        }, {
            $lookup: {
                from: "participants",
                localField: "_id",
                foreignField: "_id",
                as: "sender"
            }
        }]).toArray((err, arr) => {
            if (err) return reject(err);
            resolve(arr);
        });
    });
}

async function getMonthScore(dbo, year, month) {
    let curMonth = new Date(year, month - 1, 1, 0, 0, 0, 0);
    let nextMonth = new Date(year, month, 1, 0, 0, 0, 0);
    return new Promise((resolve, reject) => {
        dbo.collection("messages").aggregate([{
            $match: {
                'cestlheure': 1,
                'timestamp': {
                    $gte: curMonth,
                    $lt: nextMonth
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
    return getMonthScore(dbo, date.getFullYear(), date.getMonth() + 1);
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
            let promises = [];
            for (let get in getter) {
                promises.push(getter[get](dbo));
            }
            Promise.all(promises).then((results) => {
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
    getCurrentMonthScore,
    getScoreByMonth,
    getChartDataByMonth,
    getChartDataCurrentMonth
};