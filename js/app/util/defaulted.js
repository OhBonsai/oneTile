/**
 * Created by Bonsai on 16-9-8.
 */
define(function() {
    'use strict';

    function defaulted(num, def) {
        return typeof num === 'number'
            ? num
            : (typeof def === 'number' ? def : 0)
    }

    return {
        num : defaulted
    };
});
