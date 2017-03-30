
var config = require('../../config');
var async = require('async');
var _ = require('underscore');
var rest = require('restler');
var request = require('request');
var fs = require("fs");
var daikon = require('daikon');
var oc = require('orthanc-client');
var appRoot = require('app-root-path');
var parser = require('../../utilities/parser');
var dicomParser = require('../../node_modules/dicom-parser/dist/dicomParser');
var Rusha = require('../../node_modules/rusha');
var dicomjs = require('dicomjs');

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

	getInstance : function(req, res) {
		var requestId = req.body.instance_id
		var server_url = "http://35.154.52.109/instances/" + requestId + "/0/image-uint8"
    var image_name;
		console.log(server_url);

		// request.get(server_url)
    // .on('response', function(response) {
	  //   console.log(response.statusCode)
	  //   console.log(response.headers['content-type'])
		// 	var str = (response.headers['content-disposition']).split('=')
		// 	var filePath = appRoot+ '/' + str[1].replace(/['"]+/g, '')
		// 	console.log("File Path")
		// 	console.log(filePath)
		//
		// 	response.pipe(fs.createWriteStream(str[1].replace(/['"]+/g, '')))
		//
		// 	dicomjs.parseFile(filePath, function (err, dcmData) {
		// 	    console.log('Parsing file complete..');
		//
		// 	    if (!err) {
		// 	        /// Reading patient name
		// 	        var patientName = dcmData.dataset['00100010'].value;
		//
		// 	        /// TODO: Add more code here..
		// 	    } else {
		// 					console.log("ERROR")
		// 	        console.log(err);
		// 	    }
		// 	});
		//
  	// })


		request.get(server_url)
    .on('response', function(response) {
	    console.log(response.statusCode)
	    console.log(response.headers['content-type'])
			response.pipe(fs.createWriteStream('image.png'))
			var filePath = appRoot+ '/image.png'
			console.log("File Path")
			console.log(filePath)

			dicomjs.parseFile(filePath, function (err, dcmData) {
			    console.log('Parsing file complete..');

			    if (!err) {
			        /// Reading patient name
			        var patientName = dcmData.dataset['00100010'].value;

			        /// TODO: Add more code here..
			    } else {
							console.log("ERROR")
			        console.log(err);
			    }
			});

  	})

	}

}
