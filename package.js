
Package.describe({
  summary: "A simple utility class for creating AMD module managers",
});

Package.on_use(function (api) {
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
    'tests.js',
  ], 'client');
});
