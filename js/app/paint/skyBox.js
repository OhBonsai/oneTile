/**
 * Created by Bonsai on 16-9-19.
 */
define(['three','when'],function(THREE,when){
   'use strict';

    var loader = new THREE.TextureLoader();


    var createMaterial= function(path){
        var texture = loader.load(path);
        var material = new THREE.MeshBasicMaterial({map: texture, overdraw:0.5});
        return material
    };

    var skyMat = [
        createMaterial('textures/tycho2t3_80_px.jpg'),
        createMaterial('textures/tycho2t3_80_mx.jpg'),
        createMaterial('textures/tycho2t3_80_py.jpg'),
        createMaterial('textures/tycho2t3_80_my.jpg'),
        createMaterial('textures/tycho2t3_80_pz.jpg'),
        createMaterial('textures/tycho2t3_80_mz.jpg')
    ];

    var skyBox = new THREE.Mesh(new THREE.BoxGeometry(30000,30000,30000,1,1,1),
                                new THREE.MeshFaceMaterial(skyMat));
    skyBox.scale.set(-1,1,1);
    skyBox.rotation.order = 'XZY';
    skyBox.renderDepth = 200.0;
    return skyBox
});