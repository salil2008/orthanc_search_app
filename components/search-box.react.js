
var React = require('react');
var $ = require('jquery');

module.exports = SearchBox = React.createClass({

  render: function(){
    return (
      <div className="search-box-container">
        <input type="text" id = "searchbox" list = "suggestlist" />
        <img id='loading' src="https://s11.postimg.org/tf6l65lf7/image.gif"/>
        <datalist id="suggestlist"></datalist>
      </div>
    )

  }

});
