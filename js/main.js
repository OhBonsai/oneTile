/**
 * Created by Bonsai on 16-8-15.
 */
require(['../app/tile', '../app/core/math'], function (tile, MATH){
    tile.init();
    tile.animate();

    var a = [];

    for (var i=0; i<6; i++){
        a.push(parseInt(Math.random()*400));
    }

    console.log(a);

    var b = MATH.convertShapePoint2Vertex(a, 10);

    for (var i=0; i<b.length; i++){
        b[i] = parseInt(b[i]);
    }

    console.log(b);

});
