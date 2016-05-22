// server.js

// modules =================================================
var express			= require('express');
var http			= require('http');
var app				= express();
// configuration ===========================================

// set our port
var port = process.env.PORT || 8080; 

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/')); 

var server = http.createServer(app);
server.listen(port);

//routes ==================================================
require('./app/routes')(app); // configure our routes

// shoutout to the user                     
console.log('In your face!!! Listening port ' + port);

// expose app           
exports = module.exports = app;  