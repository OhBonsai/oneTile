/**
 * Created by Bonsai on 16-8-19.
 */
define(['three', '../util/__init__', '../core/const', '../core/math', './BasePaint'], function(THREE, U ,CONST, MATH, BasePaint) {
    'use strict';
    var createShapeByVertex = function(vertexArray){
        var roadShape = new THREE.Shape();
        roadShape.moveTo(vertexArray[0], vertexArray[1]);
        for (var i=2; i<vertexArray.length; i+=2){
            roadShape.lineTo(vertexArray[i], vertexArray[i+1]);
        }
        roadShape.lineTo(vertexArray[0], vertexArray[1]);
        return roadShape
    };


    var RoadShapePainter1 = function(option){
        BasePaint.call(this);
        var option = U.defined(option) ? option : {};
        var shapePoints = option.shapePoints || [110,10,10,10,110,110];
        var color = option.color || 0xfffff;

        var roadShapeVertex = MATH.convertShapePoint2Vertex(shapePoints, 2);

        var geometry = new THREE.ShapeGeometry( createShapeByVertex(roadShapeVertex) );
        var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: color, side: THREE.DoubleSide } ) );
        mesh.translateZ(0.5);
        this.mesh = mesh;
    };

    RoadShapePainter1.prototype = Object.assign(BasePaint.prototype, {
        constructor: RoadShapePainter1
    });

    
    var RoadShapeFactory = function(){};

    //createRoad function is undefined use this code
    // Object.defineProperties(RoadShapeFactory, {
    //     createRoad: function(type, option){
    //         switch (type){
    //             case CONST.RSP.STANDARD_ROAD:
    //                 return new RoadShapePainter1(option).mesh;
    //         }
    //     }
    // });

    RoadShapeFactory.prototype.createRoad = function(type, option){
        switch (type){
            case CONST.RSP.STANDARD_ROAD:
                return new RoadShapePainter1(option).mesh;
        }
    };

    
    return RoadShapeFactory;
});