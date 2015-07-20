describe('AMDManager integration', function () {
  
  var server = meteor();
  var client = browser(server);
  
  it('should work on server', function () {
    return server.execute(function () {
      var manager = new AMDManager();
    });
  });

  it('should work on client', function () {
    return client.execute(function () {
      var manager = new AMDManager();
    });
  });
  
});
