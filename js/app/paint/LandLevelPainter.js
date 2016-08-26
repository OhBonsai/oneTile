/**
 * Created by Bonsai on 16-8-19.
 */
define(['three', './BasePaint'], function(THREE, BasePaint){
    'use strict';

    var LandLevel = function () {
        BasePaint.call(this);
        this.type = 'LandLevel';
    };

    LandLevel.prototype = Object.assign(Object.create(BasePaint.prototype), {
        constructor: LandLevel,
        draw: function(option){
            var option =  option || {};
            var width = option.width || 2000;
            var length = option.length || 2000;
            var color = option.color || 0xeaeaea;
            var offsetX = option.offsetX || 0;
            var offsetY = option.offsetY || 0;

            var geometry = new THREE.PlaneGeometry(width, length);
            var material = new THREE.MeshBasicMaterial({color: color, side: THREE.DoubleSide});
            var plane = new THREE.Mesh(geometry, material);
            plane.translateX(offsetX);
            plane.translateY(offsetY);
            plane.translateZ(0.5);
            return plane;
        }
    });

    return LandLevel

});