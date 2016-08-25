/**
 * Created by Bonsai on 16-8-17.
 */
define( ['three', './container'], function (THREE, container) {
    var camera = new THREE.PerspectiveCamera( 70, 1, 1, 100000 );
    camera.position.z = 10000;

    var updateSize = function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    };
    window.addEventListener( 'resize', updateSize, false );
    updateSize();

    return camera;
} );
