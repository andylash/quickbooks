"use strict";

Package.describe({
  summary: "Quickbooks API",
  version: "0.1.0"
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.0');

  Npm.depends({
    'node-quickbooks': "1.0.3"
  });

  api.use('http', ['client', 'server']);
  api.use('templating', 'client');
  api.use('oauth1', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('random', 'client');
  api.use('underscore', 'server');
  api.use('service-configuration', ['client', 'server']);
  api.use('peerlibrary:xml2js', 'server');

  api.export('QuickBooks');

  api.addFiles(
    ['quickbooks_configure.html', 'quickbooks_configure.js'],
    'client');

  api.addFiles('quickbooks_common.js', ['client', 'server']);
  api.addFiles('quickbooks_server.js', 'server');
  api.addFiles('quickbooks_client.js', 'client');
});
