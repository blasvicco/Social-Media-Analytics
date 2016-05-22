// app/routes.js
module.exports = function(app) {
  // frontend routes =========================================================
  // verify
  app.get('/', function(req, res) {
    res.sendfile('index.html');
  });

  app.get('/getData', function(req, res) {
    var request = require('request');
    request('https://nuvi-challenge.herokuapp.com/activities', {
      'timeout' : 2500
    }, function(error, response, body) {
      try {
        if (!error && response.statusCode == 200) {
          JSON.parse(body);
          res.send(body);
          console.log('From Nuvi');
          return;
        }
      } catch (e) {}
      console.log('From file');
      fs = require('fs')
      fs.readFile('data.json', 'utf8', function(err, body) {
        if (err) {
          console.log(err);
        }
        res.send(body);
      });
    });
  })
};
