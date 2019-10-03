const express = require('express');
const fb = require('./fb');
const db = require('./db');

let app = express();
let PORT = 1234;

app.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('Vous êtes à l\'accueil');
});

app.listen(PORT);
console.log("App listening on port " + PORT);
fb.monitoring();
//fb.dump_users().then(() => console.log("Dump user done"));
/*fb.dump_thread().then(() => {
    console.log("Dump thread done")
    db.fix_heure().then(() => console.log("Fix heure done"));
});*/