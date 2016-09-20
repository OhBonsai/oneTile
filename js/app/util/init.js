/**
 * Created by Bonsai on 16-8-16.
 */
define([
    './defined',
    './defaulted',
    './DevelopError'
], function(
    defined,
    defaulted,
    DevelopError
){
    return {
        defined: defined,
        defaulted: defaulted,
        DevelopError: DevelopError
    }
});