const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors')
require('dotenv').config()

mongoose.set("strictQuery", false);
mongoose.connect('mongodb://localhost/desafiolabs');

var app = express();
app.use(cors())

app.set('port', process.env.PORT);
app.use(bodyParser.json());

require('./routes')(app);

http.createServer(app).listen(app.get('port'), function () {
	console.log("Express server listening on port " + app.get('port'));
});

module.exports = app;