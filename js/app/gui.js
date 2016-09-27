/**
 * Created by Bonsai on 16-9-8.
 */
define(['dat', './scene', './core/setting'], function (dat, scene, SETTING) {
    "use strict";

    var gui = new dat.GUI();
    var parameters = {transparent: false};


    gui.add(parameters, "transparent")
        .name("Toggle Transparency")
        .onChange(function (value) {
            //just test
        });


    var features = ['Links', 'Nodes', 'Builds', 'Names'];

    var featuresFolder = gui.addFolder('Features');
    features.forEach(function(feature){
        parameters[feature] =  SETTING.FIS[feature];
        featuresFolder.add(parameters, feature)
            .name(feature)
            .onChange(function (value){
                scene.getObjectByName(SETTING.GN[this.property]).visible = !!value;
            })
    });

    gui.open();
    
    return gui
});