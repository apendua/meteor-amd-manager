
Package.describe({
  summary: "A simple utility class for creating AMD module managers",
  version: "0.2.0",
  name: "amd:manager",
  git: "https://github.com/apendua/meteor-amd-manager.git",
});

Package.onUse(function (api) {

  api.versionsFrom([ "METEOR@0.9.0", "METEOR@1.0" ]);
  
  api.addFiles([
    'meteor/common.js',
    'lib/AMDManager.js',
    'meteor/exports.js',
  ], ['client', 'server']);
  
  api.export('AMDManager', ['client', 'server']);
});
