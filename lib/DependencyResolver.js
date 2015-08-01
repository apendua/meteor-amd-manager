(function () {
  'use strict';

  module.exports = DependencyResolver;

  function DependencyResolver () {

    var resolver = this;
    var listeners = {};
    var resolved = {};

    function each(array, it) {
      for (var i=0; i<array.length; i++) {
        it(array[i], i);
      }
    }

    function addListener (name, cb) {
      if (!listeners[name]) {
        listeners[name] = [];
      }
      listeners[name].push(cb);
    }

    function resolve (name, err, val) {
      if (resolved[name]) {
        return;
      }
      if (listeners[name]) {
        while (listeners[name].length > 0) {
          listeners[name].shift()(err, val);
        }
      }
      resolved[name] = { err: err, val: val };
    };

    resolver.depends = function (deps, cb) {
      var todo = deps.length;
      var args = [];
      var done = false;

      each(deps, function (name, i) {
        if (!resolved[name]) {
          addListener(deps[i], onResolved);
        } else {
          onResolved(name, resolved[name].err, resolved[name].val);
        }
        //------------------------------
        function onResolved (err, val) {
          if (done) {
            return;
          }
          if (err) {
            done = true;
            cb(err);
            return;
          }
          todo -= 1;
          args[i] = val;
          if (todo === 0) {
            done = true;
            cb(null, args);
          }
        }
      });
    };

    resolver.success = function (name, val) {
      resolve(name, null, val);
    };

    resolver.failure = function (name, err) {
      resolve(name, err);
    };

  }

}());
