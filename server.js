var express = require('express'),
  exphbs = require('express-handlebars'),
  http = require('http'),
  routes = require('./routes'),
  config = require('./config'),
  bodyParser = require('body-parser'),
  controller = require('./controller');

var app = express();
var port = process.env.PORT || 8080;


app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.disable('etag');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', routes.index);

app.get('/patients', routes.getPatients);
app.post('/studies', routes.getStudy);
app.post('/series', routes.getSeries);
app.post('/instances', routes.getInstance);

app.use("/", express.static(__dirname + "/public/"));

var server = http.createServer(app).listen(port, function() {
  console.log('Express server listening on port ' + port);
});
