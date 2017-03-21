
var React = require('react');

module.exports = ResultContainer = React.createClass({

  render: function(){
    var temp = this.props.res
    return (
      <li className='resultsetpoints'>
        <blockquote>
          <cite>
            <h2>{temp.login}</h2>
          </cite>
          <h4><a href={temp.html_url}>{temp.html_url}</a></h4>
        </blockquote>
      </li>
    )

  }

});
