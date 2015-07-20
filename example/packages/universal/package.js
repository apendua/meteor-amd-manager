
Package.describe({
  summary: "Example of an universal package",
  version: "1.0.0",
  name: "universal",
});

Package.onUse(function (api) {

  api.use('amd:manager');

  api.addFiles([
    'manager.js',
    'index.js',
    'exports.js',
  ], ['client', 'server']);
  
  api.export('Universal');
  
});
