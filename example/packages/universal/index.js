(function (factory) {
  'use strict';
  
  if (typeof manager !== undefined) {
    manager.common('index', [], factory);
  } else {
    factory(require, module, exports);    
  }
  
}(function (require, module, exports) {
  'use strict';
  
  exports.value = 1;
  
}));
