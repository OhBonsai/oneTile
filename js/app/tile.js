/**
 * Created by Bonsai on 16-8-15.
 */
define(['./paint/SeaLevelPainter',
        './paint/LandLevelPainter',
        './paint/LineGeometry',
        './paint/Builder1Geometry',
        // './paint/Builder1Material',
        './paint/skyBox',
        './shader/shader',
        './data/PF',
        './camera',
        './control',
        './renderer',
        './scene',
        './clock',
        './container',
        './gui',
        'three'
        ],
function(SeaLevelPainter,
         LandLevelPainter,
         LineGeometry,
         Builder1Geometry,
         // Builder1Material,
         skyBox,
         shader,
         promiseFactory,
         camera,
         control,
         renderer,
         scene,
         clock,
         container,
         gui,
         THREE){
    'use strict';

    // material
    var mat = new THREE.ShaderMaterial(shader.line.LineShader({
        side: THREE.DoubleSide,
        // diffuse: 0x5cd7ff,
        diffuse: 0xffffff,
        thickness: 2
    }));

    var dashMat = new THREE.ShaderMaterial(shader.line.LineDashShader({
        side: THREE.DoubleSide
    }));

    var graMat = new THREE.ShaderMaterial(shader.line.LineGradientShader({
        side: THREE.DoubleSide
    }));

    // var loader = new THREE.TextureLoader();
    // var buildMat = new THREE.MeshBasicMaterial({
    //     map: loader.load('textures/building-texture1.jpg'), overdraw:0.5});


    // light
    var ambientLight = new THREE.AmbientLight( 0x000000 );
    scene.add( ambientLight );

    var lights = [];
    lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

    lights[ 0 ].position.set( 0, 4000, 0 );
    lights[ 1 ].position.set( 2000, 4000, 2000 );
    lights[ 2 ].position.set( - 2000, - 4000, - 2000 );

    scene.add( lights[ 0 ] );
    scene.add( lights[ 1 ] );
    scene.add( lights[ 2 ] );


    // var time = 0.0;

    var tile = {
        init: function(){
            // Background
            var slp = new SeaLevelPainter();
            var llp = new LandLevelPainter();
            //scene.add(slp.draw());
            scene.add(llp.draw());
            scene.add(skyBox);

            // Link
            var linkGroup = new THREE.Object3D();
            linkGroup.name = 'links';
            scene.add(linkGroup);
            var oneTileLinksPromise = promiseFactory.createLinkPromise(13494, 7137);
            oneTileLinksPromise.then(function(links){
                for (var linkId in links) {
                    var linkShapePoints = links[linkId];
                    var shapePath = [];
                    for (var i=0; i<linkShapePoints.length; i+=2){
                        shapePath.push([
                            linkShapePoints[i]*2000/4096,
                            linkShapePoints[i+1]*2000/4096
                        ]);
                    }

                    var linkGeo = new LineGeometry(shapePath, {distances: false, closed: false});
                    var linkMesh = new THREE.Mesh(linkGeo, mat);
                    linkMesh.name = linkId;
                    linkGroup.add(linkMesh);
                }

            });
            linkGroup.translateX(-1000);
            linkGroup.translateY(-1000);
            
            
            //Node
            var nodeGroup = new THREE.Object3D();
            nodeGroup.name = 'nodes';
            scene.add(nodeGroup);
            var oneTileNodesPromise = promiseFactory.createNodePromise(13494, 7137);
            oneTileNodesPromise.then(function(nodes){
                for(var nodeId in nodes) {
                    var nodePoint = nodes[nodeId];
                    var nodeGeo = new THREE.SphereBufferGeometry( 1, 5, 5 );
                    var material = new THREE.MeshBasicMaterial( {color: 0x000000} );
                    var nodeMesh = new THREE.Mesh( nodeGeo, material );
                    nodeMesh.translateX(nodePoint[0]*2000/4096);
                    nodeMesh.translateY(nodePoint[1]*2000/4096);
                    nodeMesh.translateZ(5);
                    nodeMesh.name = nodeId;
                    nodeGroup.add( nodeMesh );
                }
            });
            nodeGroup.translateX(-1000);
            nodeGroup.translateY(-1000);


            //Build
            var buildGroup = new THREE.Object3D;
            buildGroup.name = 'builds';
            var oneTileBuildPromise = promiseFactory.createBuildPromise(13494, 7137);
            oneTileBuildPromise.then(function(builds){
                builds.forEach(function(build){
                    var buildGeo = new Builder1Geometry(build.pointList, build.height, build.triList);
                    var buildMesh = new THREE.Mesh(buildGeo, new THREE.MeshPhongMaterial( {
                        color: 0x156289,
                        emissive: 0x072534,
                        side: THREE.DoubleSide,
                        shading: THREE.FlatShading
                    } ));

                    // var buildMesh = new THREE.Mesh(buildGeo, buildMat);

                    buildGroup.add(buildMesh);
                })
            });
            buildGroup.translateX(-1000);
            buildGroup.translateY(-1000);
            scene.add(buildGroup);
            buildGroup.visible = false;
        },

        animate: function(){
            window.requestAnimationFrame( tile.animate );
            control.update();
            // time += clock.getDelta();
            // dashMat.uniforms.dashDistance.value = (Math.sin(time) / 2 + 0.5) * 0.5;
            // dashMat.uniforms.dashSteps.value = (Math.sin(Math.cos(time)) / 2 + 0.5) * 24;
            renderer.render(scene, camera);
        }
        
    };

    return tile
});