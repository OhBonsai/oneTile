/**
 * Created by Bonsai on 16-8-15.
 */
define(['./paint/SeaLevelPainter',
        './paint/LandLevelPainter',
        './paint/LineGeometry',
        './shader/LineShader',
        './data/SPPF',
        '../app/camera',
        '../app/control',
        '../app/renderer',
        '../app/scene',
        '../app/clock',
        './container',
        'three',
        'jquery'],
function(SeaLevelPainter,
         LandLevelPainter,
         LineGeometry,
         LineShader,
         ShapePointPromiseFactory,
         camera,
         control,
         renderer,
         scene,
         clock,
         container,
         THREE,
         $){
    'use strict';
    var mat = new THREE.ShaderMaterial(LineShader({
        side: THREE.DoubleSide,
        diffuse: 0x5cd7ff,
        thickness: 20
    }));

    var time = 0.0;

    var tile = {
        init: function(){
            var slp = new SeaLevelPainter();
            var llp = new LandLevelPainter();
            scene.add(slp.draw());
            scene.add(llp.draw());

            var tileGroup = new THREE.Object3D();
            scene.add(tileGroup);
            var oneTileShapePointsPromise = ShapePointPromiseFactory.createPromise(13494, 6866);
            var material = new THREE.LineBasicMaterial();
            oneTileShapePointsPromise.then(function(shapePoints){
                $.each(shapePoints,function(linkId, linkShapePoints){
                    var geo = new THREE.Geometry();
                    for (var i=0; i<linkShapePoints.length; i+=2){
                        geo.vertices.push(new THREE.Vector3(
                            linkShapePoints[i]*2000/4096,
                            linkShapePoints[i+1]*2000/4096, 2.0));
                    }
                    tileGroup.add(new THREE.Line(geo, material));
                });
            });

            tileGroup.translateX(-1000);
            tileGroup.translateY(-1000);


            //test basic shader

            var boxPath = [[-250, -250], [-250, 250], [250, 250], [250, -250]];
            var boxGeo = LineGeometry(boxPath, {distances: false, closed: true});
            var mesh = new THREE.Mesh(boxGeo, mat);
            scene.add(mesh);

        },

        animate: function(){
            window.requestAnimationFrame( tile.animate );
            control.update();
            time += clock.getDelta();
            mat.uniforms.thickness.value = Math.sin(time) * 20;


            renderer.render(scene, camera);
        }
        
    };

    return tile
});