// var knex = require('knex')({
// 	client: 'pg',
// 	connection: {
// 	    host     : 'ec2-54-163-224-108.compute-1.amazonaws.com',
// 			port: 5432,
//         user     : 'klgevxyemxznyx',
//         password : '934d15e1669c7413669ae386f7f0517972eadb40995a6dff358922291246793b',
//         database : 'de8rgh8tv2v743',
// 				ssl : true
// 	}
// });
//Using postgress as mysql instance is down!!!
var twitter = require('twitter');
var config = require('../../config');
var twit = new twitter(config.twitter);
var async = require('async');
var _ = require('underscore');
var sockets = require('../../socketEvents');
var io;
var rest = require('restler');
console.log(sockets);
console.log('DB Connection Established');

var self = module.exports = {
  //Methods Here
	sockets : function(server){
		io = require('socket.io').listen(server);
	},

	getUser : function(req, res) {
		var name = req.params.name
		var server_url = "https://api.github.com/search/users?q="+ name +"+in:login+type:user&per_page=10";
		rest.get(server_url).on('complete', function(data) {
		  //console.log(data);
			if(data.items) {
				res.json({statusCode : 200, data : data})
			} else {
				res.json({statusCode : 200, data : 'limit_reached'})
			}

		}).on('error', function(data) {
		  //console.log(data);
			res.json({statusCode : 500, data : data})
		});
	}

}
