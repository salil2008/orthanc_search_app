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
  },

  getPatients : function(req, res) {
    controller.generic.getPatients(req, res)
  },

  getStudy : function(req, res) {
    controller.generic.getStudy(req, res)
  },

  getSeries : function(req, res) {
    controller.generic.getSeries(req, res)
  },

  streamInstance : function(req, res) {
    controller.generic.streamInstance(req, res)
  },

  getInstance : function(req, res) {
    controller.generic.getInstance(req, res)
  }

}
