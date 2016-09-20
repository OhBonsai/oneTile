/**
 * Created by Bonsai on 16-8-17.
 */
define( ["three"], function ( THREE ) {
    'use strict';
    
    var scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0xcccccc, 0.00002 );
    return scene;
} );
