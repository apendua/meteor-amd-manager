var name = 'module2';
var deps = [
  './module1',
];

(function (factory) {
  'use strict';

  if (typeof __dirname !== 'undefined') {
      factory(require, module, exports);
  } else {
      manager.common(name, deps, factory);
  }

}(function (require, module, exports) {
  'use strict';

  var module1 = require('./module1');

  module.exports = function (a, b) {
    return a * module1(a, b);
  };

}));
