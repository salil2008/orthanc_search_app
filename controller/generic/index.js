
var config = require('../../config');
var async = require('async');
var _ = require('underscore');
var rest = require('restler');
var request = require('request');
var fs = require("fs");
var http = require('http');
var appRoot = require('app-root-path');
var parser = require('../../utilities/parser');
var dicomParser = require('../../node_modules/dicom-parser/dist/dicomParser');

var self = module.exports = {

	/*
		Get list of patients from the server
	*/

	getPatients : function(req, res) {

		var server_url = "http://35.154.52.109/patients?expand";
		rest.get(server_url).on('complete', function(data) {

			if(data && data.length > 0) {
				res.json({statusCode : 200, data : data})
			} else {
				res.json({statusCode : 200, data : []})
			}

		}).on('error', function(data) {
			res.json({statusCode : 500, data : data})
		});

	},

	/*
		Get studies for the patients from the study ids passed

		1 - Get all study ids
		2 - Query the server
		3 - Format and return response

	*/
	getStudy : function (req, res){
		//Array of ids
		var requestData = req.body.study
		var returnArray = []

		async.eachLimit(requestData, 5, function(param, eachCb) {
        var server_url = "http://35.154.52.109/studies/" + param;
        rest.get(server_url).on('complete', function(data){
						if(data) {
							var processedData = data;
	            returnArray.push(processedData);
	            eachCb(null);
						} else {
							//pass
							eachCb(null);
						}

        });
    }, function(err) {
        // done with all ajax calls
        res.json({statusCode : 200, statusMessage : "Successfully Fetched", data : returnArray});
    });

	},

	/*
		Get series for the patients from the series ids passed

		1 - Get all series ds
		2 - Query the server
		3 - Format and return response

	*/

	getSeries : function (req, res){
		//Array of ids
		var requestData = req.body.series
		var returnArray = []

		async.eachLimit(requestData, 5, function(param, eachCb) {
        var server_url = "http://35.154.52.109/series/" + param;
        rest.get(server_url).on('complete', function(data){
						if(data) {
							var processedData = data;
	            returnArray.push(processedData);
	            eachCb(null);
						} else {
							//pass
							eachCb(null);
						}

        });
    }, function(err) {
        // done with all ajax calls
        res.json({statusCode : 200, statusMessage : "Successfully Fetched", data : returnArray});
    });

	},

	streamInstance : function(req, res) {
		var requestId = req.body.instance_id
		var server_url = "http://35.154.52.109/instances/" + requestId + "/file"
    var image_name;
		console.log(server_url);
		//console.log(dict.TAG_DICT);

		http.get(server_url, function(response) {
			console.log("hit");
			var i = 0
			var data = [];
			var tagSet = []
			response.on("data", function(chunk) {
				console.log(i);
				data.push(chunk);
				i = i + 1
			});
			response.on("end", function() {
				data = Buffer.concat(data);
				var byteArray = new Uint8Array(data);

				parser.dcmController(byteArray, function(err, result){
					if(err) {
						console.log(err);
					} else if(result) {
						res.json({statusCode : 200, statusMessage : "Successfully Fetched", data : result});
					}
				})

			});
		});

	}

}
