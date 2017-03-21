
var React = require('react');
var $ = require('jquery');
var ResultSet = require('./result-set.react');
var SearchBox = require('./search-box.react');

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
    var self = this;
    //self.initiateAutocomplete();
    //className = "awesomplete" autoComplete = 'off' autoComplete = 'list'

    var typingTimer;
    var doneTypingInterval = 1000;
    var $input = $('#searchbox');

    $input.on('keyup', function () {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(doneTyping, doneTypingInterval);
    });

    $input.on('keydown', function () {
      clearTimeout(typingTimer);
    });

    function doneTyping () {
      self.onChange()
    }
  },

  // initiateAutocomplete : function(){
  //   var ajax = new XMLHttpRequest();
  //   ajax.open("GET", "https://api.github.com/search/users", true);
  //   ajax.onload = function() {
  //     console.log(ajax.responseText);
  //   	var list = JSON.parse(ajax.responseText).map(function(i) { return i.name; });
  //   	new Awesomplete(document.querySelector("#searchbox"),{ list: list });
  //   };
  //   ajax.send();
  // },

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

    var str = document.getElementById("searchbox").value;

    //console.log(str.length);

    if(str.length >= 3) {

      var successCallback = function(response){
        $( ".search-box-container" ).removeClass( "loading" )
        var flag = false

        $('#suggestlist').html('');
        this.state.remembered.forEach(function(i){
          if(i == str) {
            flag = true
          }
          $('#suggestlist').append('<option id ='+ i +'>'+i+'</option>')
        })

        if(flag) {
          //pass
        } else {
          $('#suggestlist').append('<option id ='+ str +'>'+str+'</option>')
        }
        if(response.data != 'limit_reached') {
          if(flag) {
            this.setState({
    		    	list : response.data.items
    		    })
          } else {
            this.setState({
    		    	list : response.data.items,
              remembered : this.state.remembered.concat(str)
    		    })
          }
        } else {
          if(flag) {
            this.setState({
    		    	list : []
    		    })
          } else {
            this.setState({
    		    	list : [],
              remembered : this.state.remembered.concat(str)
    		    })
          }
        }


	    }.bind(this);

	    //var server_url = "https://api.github.com/search/users?q="+ str +"+in:login+type:user&per_page=10";
      var server_url = "/user/"+str
      console.log(server_url);
      $( ".search-box-container" ).addClass( "loading" );
	    this.makeHTTPGetRequest(server_url, successCallback);
    }

  },

  render: function(){

    return (
      <div className="search-app">
        <h2 > Search Box </h2>
        <SearchBox change = {this.onChange} rlist = {this.state.remembered} />
        <ResultSet list = {this.state.list} />
      </div>
    )

  }

});
