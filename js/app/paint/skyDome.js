/**
 * Created by Bonsai on 16-9-19.
 */
define(['../shader/shader', 'three'],function(shader, THREE){
    'use strict';

    var domeMat =  new THREE.ShaderMaterial(shader.env.skyDomeShader);
    var geometry = new THREE.SphereGeometry(30000, 200, 140);
    var skyDome = new THREE.Mesh(geometry, domeMat);
    skyDome.scale.set(-1, 1, 1);
    skyDome.eulerOrder = 'XZY';
    skyDome.renderDepth = 1000.0;

    return skyDome
});