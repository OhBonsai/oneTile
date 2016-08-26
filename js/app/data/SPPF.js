/**
 * Created by Bonsai on 16-8-26.
 */
define(['when', 'jquery'], function(when, $){
    "use strict";

    var ShapePointPromiseFactory = function(){};

    ShapePointPromiseFactory.prototype.createPromise = function(x, y){
        var defered = when.defer();
        var url = 'http://192.168.10.13:8989/draw/CHN/X/Y'.replace('X', x).replace('Y', y);
        $.getJSON(url, function(data){
            defered.resolve(data.link_shape_points);
        });
        return defered.promise

    };

    return new ShapePointPromiseFactory()
});

