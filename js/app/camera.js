/**
 * Created by Bonsai on 16-8-17.
 */
define( ['three'], function (THREE) {
    var camera = new THREE.PerspectiveCamera( 70, 1, 1, 100000 );
    camera.position.z = 900;
    camera.position.y = -3072;
    

    var updateSize = function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    };
    window.addEventListener( 'resize', updateSize, false );
    updateSize();

    return camera;
} );
