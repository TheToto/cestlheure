const express = require('express');
const Twig = require('twig');
const fb = require('./fb');
const db = require('./db');
const db_fetch = require('./db_fetch');

let app = express();
let PORT = 1234;

app.get('/', function (req, res) {
    db_fetch.getData([db_fetch.getGlobalScore, db_fetch.getCurrentMonthScore, db_fetch.getScoreByMonth]).then((arr) => {
        res.render('index.twig', {
            global: arr[0],
            month: arr[1],
            bymonth: arr[2]
        });
    }).catch(res.send);
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