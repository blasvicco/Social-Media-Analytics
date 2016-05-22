// app/routes.js
// grab the nerd model we just created
module.exports = function(app) {
  // frontend routes =========================================================
  // verify
  app.get('/', function(req, res) {
    res.sendfile('index.html');
  });
};
