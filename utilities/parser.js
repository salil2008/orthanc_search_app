var config = require('../config');
var async = require('async');
var _ = require('underscore');
var dicom = require('dicom');
var fs = require("fs");
var Rusha = require('rusha');
var dicomParser = require('../node_modules/dicom-parser/dist/dicomParser');

function sha1(buffer, offset, length) {
  offset = offset || 0;
  length = length || buffer.length;
  var subArray = dicomParser.sharedCopy(buffer, offset, length);
  var rusha = new Rusha();
  return rusha.digest(subArray);
}

var self = module.exports = {
  dcmController : function(filePath) {

    console.log('File Path = ', filePath);
    var dicomFileAsBuffer = fs.readFileSync('/home/salil/salil_workspace/orthanc_search_app/image.dcm');
    console.log(dicomFileAsBuffer);

    // Print the sha1 hash for the overall file
    console.log('File SHA1 hash = ' + sha1(dicomFileAsBuffer));

    // Parse the dicom file
   try {
     var dataSet = dicomParser.parseDicom(dicomFileAsBuffer);

   // print the patient's name
     var patientName = dataSet.string('x00100010');
     console.log('Patient Name = '+ patientName);

   // Get the pixel data element and calculate the SHA1 hash for its data
     var pixelData = dataSet.elements.x7fe00010;
     var pixelDataBuffer = dicomParser.sharedCopy(dicomFileAsBuffer, pixelData.dataOffset, pixelData.length);
     console.log('Pixel Data length = ', pixelDataBuffer.length);
     console.log("Pixel Data SHA1 hash = ", sha1(pixelDataBuffer));


     if(pixelData.encapsulatedPixelData) {
       var imageFrame = dicomParser.readEncapsulatedPixelData(dataSet, pixelData, 0);
       console.log('Old Image Frame length = ', imageFrame.length);
       console.log('Old Image Frame SHA1 hash = ', sha1(imageFrame));

       if(pixelData.basicOffsetTable.length) {
         var imageFrame = dicomParser.readEncapsulatedImageFrame(dataSet, pixelData, 0);
         console.log('Image Frame length = ', imageFrame.length);
         console.log('Image Frame SHA1 hash = ', sha1(imageFrame));
       } else {
         var imageFrame = dicomParser.readEncapsulatedPixelDataFromFragments(dataSet, pixelData, 0, pixelData.fragments.length);
         console.log('Image Frame length = ', imageFrame.length);
         console.log('Image Frame SHA1 hash = ', sha1(imageFrame));
       }
     }

   }
   catch(ex) {
     console.log(ex);
   }

 },

 dcmController2 : function(filePath) {
    var decoder = dicom.decoder({
        guess_header: true
    });

    var encoder = new dicom.json.JsonEncoder();

    var print_element = function(json, elem) {
        console.log(dicom.json.get_value(json, elem));
    };

    var sink = new dicom.json.JsonSink(function(err, json) {
        if (err) {
          console.log("HERE");
          console.log("Error:", err);
          process.exit(10);
        }
        print_element(json, dicom.tags.PatientID);
        print_element(json, dicom.tags.IssuerOfPatientID);
        print_element(json, dicom.tags.StudyInstanceUID);
        print_element(json, dicom.tags.AccessionNumber);
    });

    fs.createReadStream(filePath).pipe(decoder).pipe(encoder).pipe(sink);
 }
}
