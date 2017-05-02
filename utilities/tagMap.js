var dict = require('./dataDictionary');
var _ = require('underscore');
// This function iterates through dataSet recursively and adds new HTML strings
// to the output array passed into it

function getTag(tag)
{
    var group = tag.substring(1,5);
    var element = tag.substring(5,9);
    var tagIndex = ("("+group+","+element+")").toUpperCase();
    var attr = dict.TAG_DICT[tagIndex];
    return attr;
}

var self = module.exports = {

processDataSet : function (dataSet) {
    var keys = [];
    var finalSet = [];
    for(var propertyName in dataSet.elements) {
      keys.push(propertyName);
    }
    keys.sort();

    _.each(keys, function(key){
      var current_set = {}
      var current_key = key
      var current_tag = getTag(current_key)

      current_set[current_tag.name] = dataSet.string(current_key)
      finalSet.push(current_set)

    })
    return finalSet
  }
}
