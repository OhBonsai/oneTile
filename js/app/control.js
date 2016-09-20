/**
 * Created by Bonsai on 16-8-17.
 */
define( ["three", "../app/camera"], function( THREE, camera) {
    'use strict';
    
    var control = new THREE.TrackballControls(camera);
    return control;
} );
