
var React = require('react');
var $ = require('jquery');
var ResultSet = require('./result-set.react');
var OrthancApp = require('./search-box.react');

module.exports = SearchApp = React.createClass({

  getInitialState: function(props){
    console.log("getInitialState");
    return {
      list: 'empty',
      remembered : ['empty']
    };

  },

  componentWillReceiveProps: function(newProps, oldProps){
    console.log("componentWillReceiveProps");
    this.setState(this.getInitialState(newProps));
  },

  componentDidMount: function(){
    console.log("componentDidMount");
    
  },

  componentWillMount : function() {
    console.log("componentWillMount");

  },

  makeHTTPGetRequest : function(url, successCallback){
  	$.ajax({
  	    type:'GET',
  	    url:url,
  	    datatype:'json',
  	    success: successCallback,
  	    error: function(httpRequest,status,error) {
              console.log(error);
          }
  	});
  },

  onChange : function(event){
    console.log("Changed");


  },

  render: function(){

    return (
      <div className="search-app">
        <h2 > OrthancApp </h2>
        <OrthancApp change = {this.onChange} rlist = {this.state.remembered} />
        <ResultSet list = {this.state.list} />
      </div>
    )

  }

});
