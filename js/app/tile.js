/**
 * Created by Bonsai on 16-8-15.
 */
define(['./paint/SeaLevelPainter',
        './paint/LandLevelPainter',
        '../app/camera',
        '../app/control',
        '../app/renderer',
        '../app/scene',
        './container',
        'three'],
function(SeaLevelPainter, LandLevelPainter, camera, control, renderer, scene, container, THREE){
    'use strict';

    var tile = {
        init: function(){
            var slp = new SeaLevelPainter();
            var llp = new LandLevelPainter();
            scene.add(slp.draw());
            scene.add(llp.draw());
        },

        animate: function(){
            window.requestAnimationFrame( tile.animate );
            control.update();
            renderer.render(scene, camera);
        }
        
    };

    return tile
});