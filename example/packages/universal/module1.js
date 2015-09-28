var name = 'module1';
var deps = [];

(function (factory) {
  'use strict';

  if (typeof __dirname !== 'undefined') {
      factory(require, module, exports);
  } else {
      manager.common(name, deps, factory);
  }

}(function (require, module, exports) {
  'use strict';

  module.exports = function (a, b) {
    return a + b;
  };

}));
