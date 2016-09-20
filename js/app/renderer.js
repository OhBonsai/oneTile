/**
 * Created by Bonsai on 16-8-17.
 */
define(['three', './container'], function (THREE, container) {
    'use strict';

    container.innerHTML = "";
    var renderer = new THREE.WebGLRenderer( { antialias: true });
    renderer.sortObjects = false;
    renderer.autoClear = false;
    container.appendChild( renderer.domElement );

    var updateSize = function () {
        renderer.setSize( window.innerWidth, window.innerHeight);
    };
    window.addEventListener( 'resize', updateSize, false );
    updateSize();

    return renderer;
});
