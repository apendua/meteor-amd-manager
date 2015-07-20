var expect = require('chai').expect;
var AMDManager = require('../lib/AMDManager.js');

describe('AMDManager', function () {

  var manager = new AMDManager();

  it('should be ok', function () {
    expect(manager).to.be.ok;
  });

  describe('define/require', function (test) {

    var manager = new AMDManager(),
        require = manager.require,
        define  = manager.define;

    before(function () {
      require(['a', 'b'], function (a, b) {
        expect(a).to.equal(1);
        expect(b).to.equal(2);
      });
    });

    it('should be able to define modules', function () {

      define('b', ['a', ], function () {
        return 2;
      });

      define('a', [], function () {
        return 1;
      });

    });

  });


  describe('relative paths', function (test) {

    var manager = new AMDManager(),
        require = manager.require,
        define  = manager.define,
        loaded  = false;

    define('path/to/b', ['./a', '../c', '../../path/to2/../to2/e'], function (a, c, e) {
      return a + c + e; // 6
    });

    define('path/to/a', [], function () {
      return 1;
    });

    define('path/c', ['./to/a'], function (a) {
      return 1 + 2 * a; // 3
    });

    define('path/to2/d', ['../to/b'], function (b) {
      return 4 * b + 1; // 25
    });

    define('path/to2/e', ['../to/a'], function (a) {
      return a + 1; // 2
    });

    it('should be able to use relative paths', function (done) {
      require(['path/to2/d'], function (d) {
        expect(d).to.equal(25);
        done();
      });
    });

  });

  describe('module not found', function (test) {

    var manager = new AMDManager({
          onModuleNotFound: function () {
            notFound++;
          },
        }),
        require  = manager.require,
        define   = manager.define,
        notFound = 0;

    manager.onModuleNotFound(function () {
      notFound++;
    });

    require(['a', 'b', 'c']);

    define('a', ['b', 'c'], function () {

    });

    it('should be able to use onModuleNotFound hook', function () {
      expect(notFound).to.equal(10);
    });

  });

  describe('module already defined', function (test) {

    var manager = new AMDManager({
          onModuleAlreadyDefined: function () {
            alreadyDefined++;
          }
        }),
        require  = manager.require,
        define   = manager.define,
        alreadyDefined = 0;

    manager.onModuleAlreadyDefined(function () {
      alreadyDefined++;
    });

    define('a', [], function () {

    });

    define('a', [], function () {

    });

    it('should be able to use onModuleAlreadyDefined hook', function () {
      expect(alreadyDefined).to.equal(2);
    });

  });

  describe('circular dependencies', function (test) {

    var manager = new AMDManager(),
        require = manager.require,
        define  = manager.define,
        loaded  = false;

    define('a', ['b'], function () {

    });

    define('b', ['c'], function () {

    });

    define('c', ['a'], function () {

    });

    it('module with circular dependencies should not load', function () {
      require('a', function () {
        throw new Error('module "a" was loaded');
      });
    });

  });

  describe('the context of the factory function', function (test) {

    var manager = new AMDManager(),
        require = manager.require,
        define  = manager.define;

    before(function () {
      require(['a', 'b', 'kebab-module'], function (a, b) {
        expect(a).to.equal(1);
        expect(b).to.equal(2);
        expect(this.a).to.equal(a);
        expect(this.b).to.equal(b);
        expect(this['kebab-module']).to.equal('skewered');
        expect(this.kebabModule).to.equal(undefined);
      });
    });

    it('should be able to recieve references to dependencies via `this`', function () {

      define('b', ['a', ], function () {
        return 2;
      });

      define('a', [], function () {
        return 1;
      });

      define('kebab-module', [], function(){
        return 'skewered';
      });

    });

  });


});
