/**
 * Created by Bonsai on 16-8-15.
 */
define(['./paint/SeaLevelPainter',
        './paint/LandLevelPainter',
        './paint/LineGeometry',
        './paint/skyBox',
        './shader/shader',
        './data/SPPF',
        './camera',
        './control',
        './renderer',
        './scene',
        './clock',
        './container',
        'dat',
        'three',
        'jquery'],
function(SeaLevelPainter,
         LandLevelPainter,
         LineGeometry,
         skyBox,
         shader,
         ShapePointPromiseFactory,
         camera,
         control,
         renderer,
         scene,
         clock,
         container,
         dat,
         THREE,
         $){
    'use strict';

    var mat = new THREE.ShaderMaterial(shader.line.LineShader({
        side: THREE.DoubleSide,
        diffuse: 0x5cd7ff,
        thickness: 20
    }));

    var dashMat = new THREE.ShaderMaterial(shader.line.LineDashShader({
        side: THREE.DoubleSide
    }));

    var graMat = new THREE.ShaderMaterial(shader.line.LineGradientShader({
        side: THREE.DoubleSide
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
            oneTileShapePointsPromise.then(function(shapePoints){
                $.each(shapePoints,function(linkId, linkShapePoints){
                    var geo = new THREE.Geometry();
                    var shapePath = [];
                    for (var i=0; i<linkShapePoints.length; i+=2){
                        shapePath.push([
                            linkShapePoints[i]*2000/4096,
                            linkShapePoints[i+1]*2000/4096
                        ]);
                    }

                    var linkGeo = LineGeometry(shapePath, {distances: false, closed: false});
                    tileGroup.add(new THREE.Mesh(linkGeo, mat));
                });
            });
            tileGroup.translateX(-1000);
            tileGroup.translateY(-1000);
            
            scene.add(skyBox);
            


        },

        animate: function(){
            window.requestAnimationFrame( tile.animate );
            control.update();
            time += clock.getDelta();
            renderer.render(scene, camera);
        }
        
    };

    return tile
});