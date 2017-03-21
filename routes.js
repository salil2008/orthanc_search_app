var JSX = require('node-jsx').install(),
  React = require('react'),
  searchApp = React.createFactory(require('./components/search-app-main.react')),
  controller = require('./controller');

module.exports = {

  index: function(req, res) {
    var markup = React.renderToString(
      searchApp({
        start: 'none'
      })
    );

    res.render('home', {
      markup: markup
    });

  },

  getUser : function(req, res) {
    controller.generic.getUser(req, res)
  }

}
