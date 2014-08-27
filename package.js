
Package.describe({
  summary: "A simple utility class for creating AMD module managers",
  version: "0.0.4",
  name: "apendua:amd-manager",
  git: "https://github.com/apendua/meteor-amd-manager.git",
});

Package.on_use(function (api) {
  api.versionsFrom("METEOR@0.9.0");
  api.use(['underscore'], ['client', 'server']);
  
  api.add_files([
    'manager.js',
  ], ['client', 'server']);

  if (api.export !== undefined) {
    api.export('AMDManager', ['client', 'server']);
  }
});

Package.on_test(function (api) {
  // ENVIRONMENT
  api.use('tinytest', ['client', 'server']);
  api.add_files('manager.js', ['client', 'server']);

  // TESTS
  api.add_files([
    'tinytest.js',
  ], 'client');
});
