/**
 * Created by Bonsai on 16-8-26.
 */
define(['when', 'jquery'], function(when, $){
    "use strict";

    //test tile=>13386-7137
    var PromiseFactory = function(){};

    var createPromise = function(url){
        var defered = when.defer();
        $.getJSON(url, function(data){
            defered.resolve(data);
        });
        return defered.promise
    };
    
    PromiseFactory.prototype.createLinkPromise = function(x, y){
        // var defered = when.defer();
        // var url = "http://192.168.10.13:8989/draw/CHN/13386/7137";
        // $.getJSON(url, function(data){
        //     defered.resolve(data.link_shape_points);
        // });
        // return defered.promise
        return createPromise('js/app/data/link.json')
    };

    PromiseFactory.prototype.createBuildPromise = function(x, y){
        // var defered = when.defer();
        // var url = 'js/app/data/build.json';
        // $.getJSON(url, function(data){
        //     defered.resolve(data);
        // });
        // return defered.promise
        return createPromise('js/app/data/build.json')
    };

    PromiseFactory.prototype.createNodePromise = function(x, y){
        return createPromise('js/app/data/node.json')
    };


    return new PromiseFactory()
});

