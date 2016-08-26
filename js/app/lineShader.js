/**
 * Created by Bonsai on 16-8-26.
 */
define( ["three", "../app/camera"], function( THREE, camera) {
    'use strict';

    var lineShader = new THREE.ShaderPass(THREE.ThickLineShader);
    lineShader.uniforms.totalWidth.value = window.innerWidth;
    lineShader.uniforms.totalHeight.value = window.innerHeight;
    lineShader.uniforms.edgeWidth.value = 6;
    return lineShader;
});