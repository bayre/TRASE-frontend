#!/usr/bin/env node

var CartoDB = require('cartodb');
var config = require('./cartodb-config.json');

var namedMaps = new CartoDB.Maps.Named({
  user: config.user,
  api_key: config.api_key
});

var templates = require('./templates.json');

var numTemplates = templates.length;
var currentTemplateIndex = 0;
var finalJSON = [];

var debug = false;

createTemplate();

function createTemplate() {
  var template = templates[currentTemplateIndex];
  // console.log(template)
  if (template.rasterURL) {
    nextTemplate({}, template);
    return;
  }

  namedMaps.update({
    template: template
  }).on('done', function() {
    if (debug) console.log('update ok');
    instantiateTemplate(template, nextTemplate);
  }).error(function() {
    if (debug) console.log('update err ', arguments);
    namedMaps.create({
      template: template
    }).on('done', function() {
      if (debug) console.log('create ok ');
      instantiateTemplate(template, nextTemplate);
    }).error(function() {
      if (debug) console.log('create err');
    });
  });
}

function instantiateTemplate(template, callback) {
  if (debug) console.log('instanciate', template.name);
  namedMaps.instantiate({
    template_id: template.name,
    auth_token: 'auth_token1',
  }).on('done', function(res) {
    // console.log(template)
    callback(res, template);
  }).error(function() {
    if (debug) console.log(arguments);
  });
}

function nextTemplate(res, template) {
  // console.log(template)
  finalJSON.push({
    name: template.name,
    human_name: template.human_name,
    forceZoom: template.forceZoom,
    rasterURL: template.rasterURL,
    legend: template.legend,
    layergroupid: res.layergroupid
  });
  currentTemplateIndex++;
  if (currentTemplateIndex === numTemplates) {
    console.log(finalJSON);
  } else {
    createTemplate();
  }
}
