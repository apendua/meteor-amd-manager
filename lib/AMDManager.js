
module.exports = function AMDManager (options) {
  'use strict';

  var manager = this,
      modules = {},
      notFoundHooks = [],
      alreadyDefinedHooks = [],
      loadingStack  = [];

  options = options || {};

  function each(array, it) {
    for (var i=0; i<array.length; i++) {
      it(array[i], i);
    }
  }

  function has(obj, key) {
    return obj && obj.hasOwnProperty(key);
  }

  function map(array, it) {
    var mapped = [];
    each(array, function (el, i) {
      mapped.push(it(el, i));
    });
    return mapped;
  }

  manager.onModuleNotFound = function (callback) {
    if (typeof callback === 'function') {
      notFoundHooks.push(callback);
    }
  };

  manager.onModuleNotFound(options.onModuleNotFound);

  manager.onModuleAlreadyDefined = function (callback) {
    if (typeof callback === 'function') {
      alreadyDefinedHooks.push(callback);
    }
  };

  manager.onModuleAlreadyDefined(options.onModuleAlreadyDefined);

  // taken from node.js path.js implementation
  var normalize = function (parts) {
    // if the path tries to go above the root, `up` ends up > 0
    var up = 0, i = 0, last;
    for (i = parts.length - 1; i >= 0; i--) {
      last = parts[i];
      if (last === '.') {
        parts.splice(i, 1);
      } else if (last === '..') {
        parts.splice(i, 1);
        up++;
      } else if (up) {
        parts.splice(i, 1);
        up--;
      }
    }
    return parts;
  };

  var relativeTo = function (parent) {
    var parts = parent.split('/');
    parts = parts.slice(0, Math.max(0, parts.length - 1));
    return function (name) {
      if (name.charAt(0) === '.') {
        return normalize(parts.concat(name.split('/'))).join('/');
      }
      return name;
    };
  };

  var getOrCreate = function (name) {
    if (!modules[name]) {
      modules[name] = { name : name, call : [] };
    }
    return modules[name];
  };

  manager.get = function (name) {
    return modules[name] && modules[name].data;
  };

  // - resolve relative names
  // - require all dependecies
  // - finally call module body
  function loadModule (module, action) { //XXX action can be undefined
    if (has(module, 'data')) {
      // it seems that the module has been already loaded
      if (typeof action === 'function') {
        action.call({}, module.data);
      }
    } else {
      if (typeof action === 'function') {
        module.call.push(action); // call later
      }
      if (!module.lock && has(module, 'body')) {
        module.lock = true;
        loadingStack.push(module.name);
        manager.require(map(module.deps, relativeTo(module.name)), function () {
          if (!has(module, 'data')) {
            // TODO: do we need nonreactive wrapper here?
            module.data = module.body.apply({}, arguments);
          }
          while (module.call.length > 0) {
            module.call.shift().call({}, module.data);
          }
        });
        loadingStack.pop();
        module.lock = false;
      } else {
        // module was not yet defined or it was locked
        if (module.lock) {
          console.warn('Circular dependency detected', loadingStack.join('->') + '->' + module.name + '; ',
              'dependencies for `' + module.name + '` cannot be resolved');
        } else {
          each(notFoundHooks, function (callback) {
            callback.call(manager, module);
          });
        }
      }
    }
  }

  manager.define = function (name, deps, body) {
    var module = getOrCreate(name);
    if (has(module, 'body')) {
      each(alreadyDefinedHooks, function (callback) {
        callback.call(manager, name, deps, body);
      });
      return;
    }
    module.deps = deps;
    module.body = body;
    loadModule(module);
  };

  manager.require = function (deps, body) {
    var todo = deps.length;
    var depsReady = new Array(todo);
    var depsByName = {};

    // resolve builds up:
    //   depsReady  - an array passed as an argument to the factory function
    //   depsByName - a map of dep name to dep
    var resolve = function (data, i, name) {
      depsReady[i] = depsByName[name] = data;
      if (--todo <= 0) {
        body.apply(depsByName, depsReady);
      }
    };
    if (deps.length === 0) {
      body.apply({});
    } else {
      each(deps, function (name, i) {
        loadModule(getOrCreate(name), function (data) {
          resolve(data, i, name);
        });
      });
    }
  };

  var requireFactory = function (base) {
    var resolve = relativeTo(base);
    return function require (name) {
      var module = manager.get(resolve(name));
      if (!module) {
        throw new Error('module `' + name + '` cannot be found from `' + base + '`');
      }
      return module;
    };
  };

  manager.common = function (name, deps, body) {
    manager.define(name, deps, function () {
      var exports = {};
      var module = {
        exports: exports,
      };
      body(requireFactory(name), module, exports);
      return module.exports;
    });
  };

};
