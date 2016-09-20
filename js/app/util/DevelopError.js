/**
 * Created by Bonsai on 16-8-16.
 */
/*global define*/
define([
    './defined'
], function(
    defined) {
    'use strict';

    function DeveloperError(message) {

        this.name = 'DeveloperError';
        this.message = message;

        var stack;
        try {
            throw new Error();
        } catch (e) {
            stack = e.stack;
        }

        this.stack = stack;
    }

    if (defined(Object.create)) {
        DeveloperError.prototype = Object.create(Error.prototype);
        DeveloperError.prototype.constructor = DeveloperError;
    }

    DeveloperError.prototype.toString = function() {
        var str = this.name + ': ' + this.message;

        if (defined(this.stack)) {
            str += '\n' + this.stack.toString();
        }

        return str;
    };

    DeveloperError.throwInstantiationError = function() {
        throw new DeveloperError('This function defines an interface and should not be called directly.');
    };

    return DeveloperError;
});
