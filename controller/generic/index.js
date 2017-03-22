
var config = require('../../config');
var async = require('async');
var _ = require('underscore');
var rest = require('restler');
var request = require('request');
var dicom = require('dicom');
var fs = require("fs");
var parser = require('../../utilities/parser');

var decoder = dicom.decoder({
    guess_header: true
});
var encoder = new dicom.json.JsonEncoder();

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
		var server_url = "http://35.154.52.109/instances/" + requestId + "/file"
		console.log(server_url);

		var print_element = function(json, elem) {
		    console.log(dicom.json.get_value(json, elem));
		};

		// var sink = new dicom.json.JsonSink(function(err, json) {
		//     if (err) {
		//       console.log("Error:", err);
		//       return
		//     }
		//     print_element(json, dicom.tags.PatientID);
		//     print_element(json, dicom.tags.IssuerOfPatientID);
		//     print_element(json, dicom.tags.StudyInstanceUID);
		//     print_element(json, dicom.tags.AccessionNumber);
		// });

		request.get(server_url)
		.on('response', function(response){
			console.log(response.headers['content-type'])
			parser.dcmController(response, print_element)
		})



		// rest.get(server_url).on('complete', function(dcm) {
		// 	console.log("DCM FILE FETCHED")
		// 	fs.createReadStream(dcm).pipe(decoder).pipe(encoder).pipe(sink);
		// })
	}

}
