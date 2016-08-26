/**
 * Created by Bonsai on 16-8-26.
 */
define( ['three', './renderer', './scene', './camera', './lineShader'], function ( THREE, renderer, scene, camera , lineShader) {
    'use strict';

    var targetOpts = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBFormat
    };

    var target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, targetOpts);
    var composer = new THREE.EffectComposer(renderer, target);
    
    // 1st render pass: render regular scene
    var renderPass = new THREE.RenderPass(scene, camera);

    // 2nd render pass: apply line thickness effect to the wireframe(horizontal and vertical)
    composer.addPass(renderPass);
    composer.addPass(lineShader);
    
    lineShader.renderToScreen = true;
    return composer;

});