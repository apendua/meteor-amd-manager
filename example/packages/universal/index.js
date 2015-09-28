var name = 'index';
var deps = [
  './module1',
  './module2',
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
  var module2 = require('./module2');

  exports.value = module2(2, 3);

}));
