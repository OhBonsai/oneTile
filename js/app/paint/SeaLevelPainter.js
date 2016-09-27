/**
 * Created by Bonsai on 16-8-16.
 */
define(['three', './BasePaint'], function(THREE, BasePaint){
    'use strict';

    var SeaLevel = function() {
        BasePaint.call(this);
        this.type = 'SeaLevel';
    };

    SeaLevel.prototype = Object.assign(Object.create(BasePaint.prototype), {
        constructor: SeaLevel,
        draw: function(option){
            var option =  option || {};
            var width = option.width || 4096 * 3;
            var length = option.length || 4096 * 3;
            var color = option.color || 0xa3ccff;
            var offsetX = option.offsetX || 0;
            var offsetY = option.offsetY || 0;

            var geometry = new THREE.PlaneGeometry(width, length);
            var material = new THREE.MeshBasicMaterial({color: color, side: THREE.FrontSide});
            var plane = new THREE.Mesh(geometry, material);
            plane.translateX(offsetX);
            plane.translateY(offsetY);
            return plane
        }
    });

    return SeaLevel

});