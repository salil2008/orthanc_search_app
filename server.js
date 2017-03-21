var express = require('express'),
  exphbs = require('express-handlebars'),
  http = require('http'),
  twitter = require('twitter'),
  routes = require('./routes'),
  config = require('./config'),
  bodyParser = require('body-parser'),
  controller = require('./controller');

var app = express();
var port = process.env.PORT || 8080;


app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.disable('etag');


var twit = new twitter(config.twitter);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', routes.index);
app.get('/user/:name', routes.getUser);

app.use("/", express.static(__dirname + "/public/"));

var server = http.createServer(app).listen(port, function() {
  console.log('Express server listening on port ' + port);
});

//var io = require('socket.io').listen(server);
controller.generic.sockets(server);
// twit.stream('statuses/filter',{ track: '#HashTag'}, function(stream){
//   controller.generic.saveStream(stream,io);
// });
