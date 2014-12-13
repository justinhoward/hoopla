'use strict';
/* global describe, it */

var Hoopla = require('../hoopla');
var expect = require('chai').expect;

describe('Hoopla', function() {
    it('can add a listener', function() {
        var dispatcher = new Hoopla();
        var listener = function() {};
        dispatcher.addListener('test', listener);
        expect(dispatcher.hasListeners('test')).to.equal(true);
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
        dispatcher.addListener('test', listenerB, 0);
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

    it('dispatches events with arguments', function() {
        var dispatcher = new Hoopla();
        var a, b;
        dispatcher.addListener('test', function(x, y) {
            a = x;
            b = y;
        });
        dispatcher.dispatch('test', 'a', 'b');
        expect(a).to.equal('a');
        expect(b).to.equal('b');
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
});