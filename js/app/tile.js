/**
 * Created by Bonsai on 16-8-15.
 */
define(['./paint/SeaLevelPainter',
        './paint/LandLevelPainter',
        './paint/LineGeometry',
        './paint/Builder1Geometry',
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
         Builder1Geometry,
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
                    var shapePath = [];
                    for (var i=0; i<linkShapePoints.length; i+=2){
                        shapePath.push([
                            linkShapePoints[i]*2000/4096,
                            linkShapePoints[i+1]*2000/4096
                        ]);
                    }

                    var linkGeo = new LineGeometry(shapePath, {distances: false, closed: false});
                    tileGroup.add(new THREE.Mesh(linkGeo, mat));
                });
            });
            tileGroup.translateX(-1000);
            tileGroup.translateY(-1000);
            
            scene.add(skyBox);

            //BUILD
            var mapPointList = [[2502, 3949], [1838, 3931], [1838, 3896], [1913, 3792], [1943, 3792], [2055, 3539], [2017, 3539], [2017, 3495], [2099, 3399], [2129, 3399], [2241, 3147], [2219, 3147], [2219, 3121], [2360, 2990], [2539, 2990], [2532, 3155], [2330, 3164], [2211, 3399], [2524, 3399], [2524, 3548], [2151, 3548], [2025, 3792], [2502, 3809]];
            var height = 15;
            var triList = [[17, 18, 19], [17, 19, 20], [17, 20, 10], [17, 10, 16], [20, 21, 5], [20, 5, 8], [20, 8, 9], [20, 9, 10], [5, 21, 4], [4, 21, 0], [4, 0, 3], [3, 0, 1], [3, 1, 2], [13, 14, 15], [13, 15, 16], [13, 16, 10], [13, 10, 11], [13, 11, 12], [6, 7, 8], [6, 8, 5], [0, 21, 22]];
            var pointList = [];

            mapPointList.forEach(function(point){
                pointList.push([point[0]*0.488, (4096-point[1])*0.488]);
            });

            var buildGeo = new Builder1Geometry(pointList, height, triList);
            var build = new THREE.Mesh(buildGeo, new THREE.MeshBasicMaterial({
                color:new THREE.Color(0xff0000),side: THREE.DoubleSide}))
            build.translateX(-1000);
            build.translateY(-1000);
            scene.add(build);


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