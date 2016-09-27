/**
 * Created by Bonsai on 16-8-15.
 */
define(['./paint/SeaLevelPainter',
        './paint/LandLevelPainter',
        './paint/LineGeometry',
        './paint/Builder1Geometry',
        // './paint/Builder1Material',
        './paint/skyBox',
        './paint/NameSprite',
        './shader/shader',
        './data/PF',
        './core/setting',
        './camera',
        './control',
        './renderer',
        './scene',
        './clock',
        './container',
        './gui',
        './event/objectMarker',
        'three'
        ],
function(SeaLevelPainter,
         LandLevelPainter,
         LineGeometry,
         Builder1Geometry,
         // Builder1Material,
         skyBox,
         NameSprite,
         shader,
         promiseFactory,
         SETTING,
         camera,
         control,
         renderer,
         scene,
         clock,
         container,
         gui,
         objectMarker,
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
    var ambientLight = new THREE.AmbientLight(0x000000);
    scene.add(ambientLight);

    var lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);

    lights[0].position.set(0, 4000, 0);
    lights[1].position.set(2000, 4000, 2000);
    lights[2].position.set(-2000, -4000, -2000);

    scene.add(lights[0]);
    scene.add(lights[1]);
    scene.add(lights[2]);


    // var time = 0.0;

    var tile = {
        init: function () {
            // Background
            var slp = new SeaLevelPainter();
            var llp = new LandLevelPainter();
            //scene.add(slp.draw());
            scene.add(llp.draw());
            scene.add(skyBox);

            // Link
            var linkGroup = new THREE.Object3D();
            linkGroup.name = SETTING.GN.Links;
            scene.add(linkGroup);
            var oneTileLinksPromise = promiseFactory.createLinkPromise(13494, 7137);
            oneTileLinksPromise.then(function (links) {
                for (var linkId in links) {
                    var linkShapePoints = links[linkId];
                    var shapePath = [];
                    for (var i = 0; i < linkShapePoints.length; i += 2) {
                        shapePath.push([
                            linkShapePoints[i],
                            linkShapePoints[i + 1]
                        ]);
                    }

                    var linkGeo = new LineGeometry(shapePath, {distances: false, closed: false});
                    var linkMesh = new THREE.Mesh(linkGeo, mat);
                    linkMesh.name = linkId;
                    linkMesh.bonsaiType = SETTING.BTP.Link;
                    linkGroup.add(linkMesh);
                }

            });
            linkGroup.translateX(-2048);
            linkGroup.translateY(-2048);
            linkGroup.visible = SETTING.FIS.Links;


            //Node
            var nodeGroup = new THREE.Object3D();
            nodeGroup.name = SETTING.GN.Nodes;
            scene.add(nodeGroup);
            var oneTileNodesPromise = promiseFactory.createNodePromise(13494, 7137);
            oneTileNodesPromise.then(function (nodes) {
                for (var nodeId in nodes) {
                    var nodePoint = nodes[nodeId];
                    var nodeGeo = new THREE.SphereBufferGeometry(5, 5, 5);
                    var material = new THREE.MeshBasicMaterial({color: 0x000000});
                    var nodeMesh = new THREE.Mesh(nodeGeo, material);
                    nodeMesh.translateX(nodePoint[0]);
                    nodeMesh.translateY(nodePoint[1]);
                    nodeMesh.translateZ(5);
                    nodeMesh.name = nodeId;
                    nodeMesh.bonsaiType = SETTING.BTP.Node;
                    nodeGroup.add(nodeMesh);
                }
            });
            nodeGroup.translateX(-2048);
            nodeGroup.translateY(-2048);
            nodeGroup.visible = SETTING.FIS.Nodes;


            //Build
            var buildGroup = new THREE.Object3D();
            buildGroup.name = SETTING.GN.Builds;
            scene.add(buildGroup);
            var oneTileBuildPromise = promiseFactory.createBuildPromise(13494, 7137);
            oneTileBuildPromise.then(function (builds) {
                builds.forEach(function (build) {
                    var buildGeo = new Builder1Geometry(build.pointList, build.height*4096/2000, build.triList);
                    var buildMesh = new THREE.Mesh(buildGeo, new THREE.MeshPhongMaterial({
                        color: 0x156289,
                        emissive: 0x072534,
                        side: THREE.DoubleSide,
                        shading: THREE.FlatShading
                    }));
                    // var buildMesh = new THREE.Mesh(buildGeo, buildMat);
                    buildMesh.bonsaiType = SETTING.BTP.Build;
                    buildGroup.add(buildMesh);
                })
            });
            buildGroup.translateX(-2048);
            buildGroup.translateY(-2048);
            buildGroup.visible = SETTING.FIS.Builds;


            //Name
            var nameGroup = new THREE.Object3D();
            nameGroup.name = SETTING.GN.Names;
            scene.add(nameGroup);
            var oneTileNamePromise = promiseFactory.createNamePromise(13494, 7137);
            oneTileNamePromise.then(function(names){
                names.forEach(function (name){
                    var nameSprite = new NameSprite(name.name).getLabel();
                    nameSprite.position.set(name.pos[0], name.pos[1], 5);
                    nameSprite.bonsaiType = SETTING.BTP.Name;
                    nameGroup.add(nameSprite);
                })
            });
            nameGroup.translateX(-2048);
            nameGroup.translateY(-2048);
            nameGroup.visible = SETTING.FIS.Names;

        },

        animate: function () {
            window.requestAnimationFrame(tile.animate);
            control.update();
            // time += clock.getDelta();
            // dashMat.uniforms.dashDistance.value = (Math.sin(time) / 2 + 0.5) * 0.5;
            // dashMat.uniforms.dashSteps.value = (Math.sin(Math.cos(time)) / 2 + 0.5) * 24;
            renderer.render(scene, camera);
        }

    };

    return tile
});