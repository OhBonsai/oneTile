/**
 * Created by Bonsai on 16-8-15.
 */
define(['./paint/SeaLevelPainter',
        './paint/LandLevelPainter',
        './data/SPPF',
        '../app/camera',
        '../app/control',
        '../app/renderer',
        '../app/scene',
        '../app/composer',
        '../app/lineShader',
        './container',
        'three',
        'jquery'],
function(SeaLevelPainter,
         LandLevelPainter,
         ShapePointPromiseFactory,
         camera,
         control,
         renderer,
         scene,
         composer,
         lineShader,
         container,
         THREE,
         $){
    'use strict';

    var tile = {
        init: function(){
            var slp = new SeaLevelPainter();
            var llp = new LandLevelPainter();
            scene.add(slp.draw());
            scene.add(llp.draw());


            var oneTileShapePointsPromise = ShapePointPromiseFactory.createPromise(13494, 6866);
            var material = new THREE.MeshBasicMaterial({wireframe:true});
            oneTileShapePointsPromise.then(function(shapePoints){
                $.each(shapePoints,function(linkId, linkShapePoints){
                    var geo = new THREE.Geometry();
                    for (var i=0; i<linkShapePoints.length; i+=2){
                        geo.vertices.push(new THREE.Vector3(
                            linkShapePoints[i]*2000/4096,
                            linkShapePoints[i+1]*2000/4096, 1.0));
                    }
                    scene.add(new THREE.Line(geo, material));
                });
            });
        },

        animate: function(){
            window.requestAnimationFrame( tile.animate );
            control.update();
            composer.render();
        }
        
    };

    return tile
});