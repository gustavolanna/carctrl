"use strict"

let captcha = require('../index.js');
let sould = require('should');

describe('Testing captcha breaker', function() {

    it('Should be 1ipxu6', function(done) {
        captcha('./test/1ipxu6.jpg', function(err, value){
            value.should.equal('1ipxu6');
            done();
        });
    });

    it('Should be 5gs26m', function(done) {
        captcha('./test/5gs26m.jpeg', function(err, value){
            value.should.equal('5gs26m');
            done();
        });
    });

    it('Should be b6ngnf', function(done) {
        captcha('./test/b6ngnf.jpeg', function(err, value){
            value.should.equal('b6ngnf');
            done();
        });
    });

    it('Should be qb7458', function(done) {
        captcha('./test/qb7458.jpeg', function(err, value){
            value.should.equal('qb7458');
            done();
        });
    });

    it('Should be sh94g2', function(done) {
        captcha('./test/sh94g2.jpeg', function(err, value){
            value.should.equal('sh94g2');
            done();
        });
    });

    it('Should be w8vmhn', function(done) {
        captcha('./test/w8vmhn.jpeg', function(err, value){
            value.should.equal('w8vmhn');
            done();
        });
    });

});