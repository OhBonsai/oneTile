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
            var width = option.width || 4096;
            var length = option.length || 4096;
            var color = option.color || 0xeaeaea;
            var offsetX = option.offsetX || 0;
            var offsetY = option.offsetY || 0;

            var geometry = new THREE.PlaneGeometry(width, length);
            // var material = new THREE.MeshBasicMaterial({color: color, side: THREE.DoubleSide});

            var loader = new THREE.TextureLoader();
            var groundTexture = loader.load( 'textures/grasslight-big.jpg' );
            groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
            groundTexture.repeat.set( 25, 25 );
            groundTexture.anisotropy = 16;
            var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture } );

            var plane = new THREE.Mesh(geometry, groundMaterial);
            plane.translateX(offsetX);
            plane.translateY(offsetY);
            plane.translateZ(2);
            return plane;
        }
    });

    return LandLevel

});