'use strict';

var Hoopla = require('../src/Hoopla');
var expect = require('chai').expect;

describe('Hoopla', function() {
    it('can add a listener', function() {
        var dispatcher = new Hoopla();
        var listener = function() {};
        dispatcher.addListener('test', listener);
        expect(dispatcher.hasListeners('test')).to.be.true();
        expect(dispatcher.getListeners('test')).to.deep.equal([listener]);
    });

    it('can get listeners in order', function() {
        var dispatcher = new Hoopla();
        var listenerA = function() {};
        var listenerB = function() {};
        dispatcher.addListener('test', listenerA);
        dispatcher.addListener('test', listenerB);
        expect(dispatcher.getListeners('test')).to.deep.equal([listenerA, listenerB]);
    });

    it('can get listeners in order of priority', function() {
        var dispatcher = new Hoopla();
        var listenerA = function() {};
        var listenerB = function() {};
        var listenerC = function() {};
        dispatcher.addListener('test', listenerC, 1);
        dispatcher.addListener('test', listenerB);
        dispatcher.addListener('test', listenerA, -1);
        expect(dispatcher.getListeners('test')).to.deep.equal([listenerA, listenerB, listenerC]);
    });

    it('can dispatch events', function() {
        var dispatcher = new Hoopla();
        var a, b, c;
        dispatcher.addListener('test', function() {
            a = true;
        }, -1);
        dispatcher.addListener('test', function() {
            b = true;
        });
        dispatcher.addListener('test', function() {
            c = true;
        });

        dispatcher.dispatch('test');

        expect(a).to.equal(true);
        expect(b).to.equal(true);
        expect(c).to.equal(true);
    });

    it('dispatches a string event with an event object', function() {
        var dispatcher = new Hoopla();
        var event;
        dispatcher.addListener('test', function(ev) {
            event = ev;
        });
        dispatcher.dispatch('test', {foo: 'foo val'});
        expect(event.getName()).to.equal('test');
        expect(event.get('foo')).to.equal('foo val');
    });

    it('can dispatch twice', function() {
        var dispatcher = new Hoopla();
        var calls = 0;
        dispatcher.addListener('test', function() {
            calls++;
        });
        dispatcher.dispatch('test');
        dispatcher.dispatch('test');
        expect(calls).to.equal(2);
    });

    it('can create an event object', function() {
        var dispatcher = new Hoopla();
        var event = dispatcher.createEvent('myEvent', {foo: 'foo val', bar: 'bar val'});
        expect(event.getName()).to.equal('myEvent');
        expect(event.get('foo')).to.equal('foo val');
        expect(event.get('bar')).to.equal('bar val');
    });

    it('can stop propagation', function() {
        var dispatcher = new Hoopla();
        var calledFirst = false, calledSecond = false;
        dispatcher.addListener('test', function(event) {
            calledFirst = true;
            event.stopPropagation();
        });

        dispatcher.addListener('test', function() {
            calledSecond = true;
        });
        dispatcher.dispatch('test');

        expect(calledFirst).to.be.true();
        expect(calledSecond).to.be.false();
    });

    it('can dispatch with an event object', function() {
        var dispatcher = new Hoopla();
        var event = dispatcher.createEvent('myEvent');
        var listenerEvent;
        dispatcher.addListener('myEvent', function(ev) {
            listenerEvent = ev;
        });
        dispatcher.dispatch(event);
        expect(listenerEvent).to.equal(event);
    });
});