/**
 * Created by Bonsai on 16-8-17.
 */
define( ["three", "../app/camera", "../app/renderer"], function( THREE, camera, renderer) {
    'use strict';
    
    var control = new THREE.TrackballControls(camera, renderer.domElement);
    return control;
} );
