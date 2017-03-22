var config = require('../config');
var async = require('async');
var _ = require('underscore');
var rest = require('restler');
var request = require('request');
var dicom = require('dicom');
var fs = require("fs");
var Busboy = require('busboy');

var decoder = dicom.decoder({
    guess_header: true
});
var encoder = new dicom.json.JsonEncoder();

var self = module.exports = {
  dcmController : function(req, callback) {
    //console.log(file);

    // Create an Busyboy instance passing the HTTP Request headers.
    var busboy = new Busboy({ headers: req.headers });

    // Listen for event when Busboy finds a file to stream.
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

      // We are streaming! Handle chunks
      file.on('data', function (data) {
        // Here we can act on the data chunks streamed.
        console.log('Handle chunks of data')
        console.log(data)
      });

      // Completed streaming the file.
      file.on('end', function () {
        console.log('Finished with ' + fieldname);
      });
    });

    // Listen for event when Busboy finds a non-file field.
    busboy.on('field', function (fieldname, val) {
      // Do something with non-file field.
    });

    // Listen for event when Busboy is finished parsing the form.
    busboy.on('finish', function () {
      res.statusCode = 200;
      res.end();
    });

    // Pipe the HTTP Request into Busboy.
    req.pipe(busboy);

  }
}
