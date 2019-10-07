const express = require('express');
const Twig = require('twig');
const fb = require('./fb');
const db = require('./db');
const db_fetch = require('./db_fetch');
const path = require('path');

let app = express();
let PORT = 1234;

app.get('/', function (req, res) {
    db_fetch.getData([db_fetch.getGlobalScore, db_fetch.getCurrentMonthScore, db_fetch.getScoreByMonth, db_fetch.getChartDataByMonth, db_fetch.getChartDataCurrentMonth]).then((arr) => {
        res.render('index.twig', {
            global: arr[0],
            month: arr[1],
            bymonth: arr[2],
            json_chart_bymonth: JSON.stringify(arr[3]),
            json_chart_curmonth: JSON.stringify(arr[4])
        });
    }).catch(res.send);
}).get('/static/:name', function (req, res) {
    res.sendFile(req.params.name, {
        root: path.join(__dirname, 'static')
    });
});

app.listen(PORT);
console.log("App listening on port " + PORT);
//fb.monitoring();
//fb.dump_users().then(() => console.log("Dump user done"));
/*fb.dump_thread().then(() => {
    console.log("Dump thread done");
    db.fix_heure().then(() => console.log("Fix heure done"));
});*/
//db.fix_heure().then(() => console.log("Fix heure done"));