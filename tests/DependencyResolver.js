var expect = require('chai').expect;
var DependencyResolver = require('../lib/DependencyResolver.js');

describe('Test DependencyResolver', function () {

    function getToken() {
        return Math.floor(1000 * Math.random());
    }

    beforeEach(function () {
        this.resolver = new DependencyResolver();
    });
    
    it('should resolve a single dependency', function (done) {
        var token = getToken();
        this.resolver.depends([ 'dep1' ], function (err, deps) {
            expect(deps[0]).to.equal(token);
            done();
        });
        setTimeout(function () {
            this.resolver.success('dep1', token);
        }.bind(this), 10);
    });

    it('should resolve multiple dependencies', function (done) {
        var tokens = [ getToken(), getToken(), getToken() ];
        this.resolver.depends([ 0, 1, 2 ], function (err, deps) {
            expect(deps).to.eql(tokens);
            done();
        });
        tokens.forEach(function (value, index) {
            this.resolver.success(index, value);
        }.bind(this));
    });

    

});