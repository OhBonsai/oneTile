/**
 * Created by Bonsai on 16-8-15.
 */
define(['./paint/SeaLevelPainter',
        './paint/LandLevelPainter',
        './paint/LineGeometry',
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

            // var gui = new dat.GUI({
            //     height : 5 * 32 - 1
            // });
            //
            // gui.add({Width: 10}, 'Width', 0, 20).onChange(function(value){mat.uniforms.thickness.value = value;});
            // gui.addColor({Color: [92,215,255]}, 'Color').onChange(function(value){mat.uniforms.diffuse.value = new THREE.Color(value[0]/255.0,value[1]/255.0,value[2]/255.0);});
            var gui_control = function () {

                this.option1=false;
                this.option2=false;
                this.option3=false;


            };

            function gui()
            {
                var gui_controls=new gui_control();
                var gui = new dat.GUI({autoPlace:true});
                gui.add(gui_controls,'option1').onFinishChange(function(v){
                    gui_controls.option2 = true;
                    // Iterate over all controllers
                    for (var i in gui.__controllers) {
                        gui.__controllers[i].updateDisplay();
                    }
                });
                gui.add(gui_controls,'option2');
                gui.add(gui_controls,'option3');
            }

            gui();


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


            // add dash line box
            var boxPath = [[0, 0], [500, 0], [500, 500], [0, 500]];
            var boxGeo = LineGeometry(boxPath, { distances: true, closed: true });

            var mesh2 = new THREE.Mesh(boxGeo, graMat);
            scene.add(mesh2);

        },

        animate: function(){
            window.requestAnimationFrame( tile.animate );
            control.update();
            time += clock.getDelta();

            //console.log(time);

            // dashMat.uniforms.dashDistance.value = (Math.sin(time) / 2 + 0.5) * 0.5;
            dashMat.uniforms.dashSteps.value = (Math.sin(Math.cos(time)) / 2 + 0.5) * 24;
            graMat.uniforms.time.value = time;

            renderer.render(scene, camera);
        }
        
    };

    return tile
});