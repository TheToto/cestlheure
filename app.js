const CronJob = require('cron').CronJob;
const express = require('express');
const Twig = require('twig');
const fb = require('./fb');
const db = require('./db');
const db_fetch = require('./db_fetch');
const path = require('path');

let app = express();
let PORT = 1234;

new CronJob('30 0 0 1 * *', function() {
    fb.sendMonthlyReport();
}, null, true, 'Europe/Paris');

app.get('/', function (req, res) {
    db_fetch.getData([db_fetch.getGlobalScore, db_fetch.getScoreByMonth, db_fetch.getLastCestLheure]).then((arr) => {
        res.render('index.twig', {
            global: arr[0],
            bymonth: arr[1],
            lastcestlheure: arr[2][0]
        });
    }).catch(res.send);
}).get('/user/:userid', function (req, res) {
    db_fetch.getData([(dbo) => db_fetch.getUser(dbo, req.params.userid)]).then((arr) => {
        console.log(arr);
        res.render('user.twig', {
            user: arr[0][0]
        });
    }).catch(res.send);
}).get('/static/:name', function (req, res) {
    res.sendFile(req.params.name, {
        root: path.join(__dirname, 'static')
    });
}).get('/graph/user/:userid', function (req, res) {
    db_fetch.getData([(dbo) => db_fetch.getUserDetail(dbo, req.params.userid)]).then((arr) => {
        res.json(arr[0]);
    }).catch(res.send);
}).get('/graph/:year/:month', function (req, res) {
    db_fetch.getData([(dbo) => {
        return db_fetch.getChartDataMonth(dbo, parseInt(req.params.year), parseInt(req.params.month))
    }]).then((arr) => {
        res.json(arr[0]);
    }).catch(res.send);
}).get('/graph/global', function (req, res) {
    db_fetch.getData([db_fetch.getChartDataByMonth]).then((arr) => {
        res.json(arr[0]);
    }).catch(res.send);
});

if (process.env.ENABLE_SERV == '1') {
    app.listen(PORT);
    console.log("App listening on port " + PORT);
}

if (process.env.ENABLE_FB == '1') {
    fb.monitoring();
}

if (process.env.DEBUG_DUMP_USER == '1') {
    fb.dump_users().then(() => console.log("Dump user done"));
} else if (process.env.DEBUG_DUMP_THREAD == '1') {
    fb.dump_thread().then(() => {
        console.log("Dump thread done");
        db.fix_heure().then(() => console.log("Fix heure done"));
    });
} else if (process.env.DEBUG_FIX_HEURE == '1') {
    db.fix_heure().then(() => console.log("Fix heure done"));
}