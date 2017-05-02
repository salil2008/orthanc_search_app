var config = require('../config');
var async = require('async');
var _ = require('underscore');
var dicom = require('dicom');
var fs = require("fs");
var Rusha = require('rusha');
var tagMapper = require('./tagMap');
var dicomParser = require('../node_modules/dicom-parser/dist/dicomParser');

function sha1(buffer, offset, length) {
  offset = offset || 0;
  length = length || buffer.length;
  var subArray = dicomParser.sharedCopy(buffer, offset, length);
  var rusha = new Rusha();
  return rusha.digest(subArray);
}

var self = module.exports = {

 dcmController : function(byteArray, callback) {
   try
   {
      // Parse the byte array to get a DataSet object that has the parsed contents
      var dataSet = dicomParser.parseDicom(byteArray/*, options */);
      var result = tagMapper.processDataSet(dataSet)
      if(result.length > 0) {
        callback(null, result)
      }

   }
   catch(ex)
   {
      console.log('Error parsing byte stream' - ex);
   }
 }
}
