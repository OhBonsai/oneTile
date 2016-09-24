/**
 * Created by Bonsai on 16-9-8.
 */
define(['dat', './scene'], function (dat, scene) {
    "use strict";

    var gui = new dat.GUI();
    var parameters = {transparent: false};


    gui.add(parameters, "transparent")
        .name("Toggle Transparency")
        .onChange(function (value) {
            //just test
        });


    var features = {
        Link : 'links',
        Node : 'nodes',
        Build : 'builds'
    };
    var featuresFolder = gui.addFolder('Features');
    for (var feature in features){
        parameters[feature] =  function(){};
        featuresFolder.add(parameters, feature)
            .name(feature)
            .onChange(function (value){
                scene.getObjectByName(features[this.property]).visible =
                    !scene.getObjectByName(features[this.property]).visible;
            })
    }

    // gui.open();

    return gui
});