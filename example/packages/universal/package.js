
Package.describe({
  summary: "Example of an universal package",
  version: "1.0.0",
  name: "universal",
});

Package.onUse(function (api) {

  api.use('amd:manager');

  api.addFiles([

    '_.js',
    'index.js',
    'module1.js',
    'module2.js',
    'exports.js',

  ], ['client', 'server']);

  api.export('Universal');

});
