/**
 * Created by Bonsai on 16-8-19.
 */
define(['three', '../core/const', '../core/math', './BasePaint'], function(THREE, CONST, MATH, BasePaint) {
    'use strict';
    
    var RoadShapePainter1 = function(){
        BasePaint.call(this);

    };

    RoadShapePainter1.prototype = Object.assign(BasePaint.prototype, {
        constructor: RoadShapePainter1
    });
    
    
    var RoadShapeFactory = function(){};
    Object.defineProperties(RoadShapeFactory, {
        createRoad: function(type, option){
            switch (type){
                case CONST.RSP.STANDARD_ROAD:
                    return new RoadShapePainter1(option) 
            }
        }    
    });
    
    
    return RoadShapeFactory;
});