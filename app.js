const express = require('express');
const Twig = require('twig');
const fb = require('./fb');
const db_fetch = require('./db_fetch');

let app = express();
let PORT = 1234;

app.get('/', function (req, res) {
    db_fetch.getData(db_fetch.getGlobalScore).then((arr) => {
        res.render('index.twig', {
            data: arr
        });
    }).catch((err) => res.send(err));
});

app.listen(PORT);
console.log("App listening on port " + PORT);
fb.monitoring();
//fb.dump_users().then(() => console.log("Dump user done"));
/*fb.dump_thread().then(() => {
    console.log("Dump thread done");
    db.fix_heure().then(() => console.log("Fix heure done"));
});*/
//db.fix_heure().then(() => console.log("Fix heure done"));