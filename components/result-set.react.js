
var React = require('react');
var _ = require('underscore');
var ResultContainer = require('./result-container.react');

module.exports = ResultSet = React.createClass({


  render: function(){
      console.log(this.props.list);
      var list = this.props.list
      if(list.length > 0) {
        var content = _.map(list,function(temp){
          return (
            <ResultContainer res={temp}/>
          )
        });
      }

    return (
      <ul className="resp">{content}</ul>
    )

  }

});
