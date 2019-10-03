const express = require('express');
const fb = require('./fb');
const db = require('./db');

let app = express();
let PORT = 1234;

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('Vous êtes à l\'accueil');
});

app.listen(PORT);
console.log("App listening on port " + PORT);
fb.monitoring();
//fb.dump_users();
//fb.dump_thread();
//db.fix_heure();