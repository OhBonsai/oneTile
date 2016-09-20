/**
 * Created by Bonsai on 16-8-16.
 */
define(['../util/util'],function(U){
    'use strict';
    
    var BasePaint = function(){};

    Object.defineProperties(BasePaint, {
        type: {
            value: 'BasePaint'
        },
        
        draw: function(){
            throw new U.DeveloperError('This function defines an interface and should not be called directly.');
        }
    });

    return BasePaint

});