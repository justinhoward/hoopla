'use strict';

var Event = require('../src/Event');
var expect = require('chai').expect;

describe('Event', function() {
    it('can be constructed', function() {
        var event = new Event('foo');
        expect(event.getName()).to.equal('foo');
        expect(event.getAttributes()).to.deep.equal({});
    });

    it('can set an attribute', function() {
        var event = new Event('foo');
        event.set('foo', 'foo val');
        expect(event.get('foo')).to.equal('foo val');
    });

    it('can set attributes', function() {
        var event = new Event('foo');
        var attrs = {foo: 'foo val', bar: 'bar val'};
        event.setAttributes(attrs);
        expect(event.getAttributes()).to.deep.equal(attrs);
    });

    it('can stop propagation', function() {
        var event = new Event('foo');

        expect(event.isPropagationStopped()).to.be.false();
        event.stopPropagation();
        expect(event.isPropagationStopped()).to.be.true();
    });
});