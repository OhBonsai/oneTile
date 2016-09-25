/**
 * Created by Bonsai on 16-9-25.
 */
define(["../util/util","three"],function(U,THREE){
    'use strict';

    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x+r, y);
        ctx.lineTo(x+w-r, y);
        ctx.quadraticCurveTo(x+w, y, x+w, y+r);
        ctx.lineTo(x+w, y+h-r);
        ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
        ctx.lineTo(x+r, y+h);
        ctx.quadraticCurveTo(x, y+h, x, y+h-r);
        ctx.lineTo(x, y+r);
        ctx.quadraticCurveTo(x, y, x+r, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    var NameSprite = function(text, options){
        var options = options || {};
        var fontface = U.defined(options.fontface) ? options.fontface : "Arial";
        var fontsize = U.defined(options.fontsize) ? options.fontsize : 40;
        var borderThickness = U.defined(options.borderThickness) ? options.borderThickness : 2;
        var borderColor = U.defined(options.borderColor) ? options.borderColor : { r:0, g:0, b:0, a:0.5 };
        var backgroundColor = U.defined(options.backgroundColor) ? options.backgroundColor : { r:255, g:255, b:255, a:1.0 };
        //var spriteAlignment = THREE.SpriteAlignment.topLeft;

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.font = "Bold " + fontsize + "px " + fontface;

        var metrics = context.measureText(text);
        var textWidth = metrics.width;

        context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
            + backgroundColor.b + "," + backgroundColor.a + ")";
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
            + borderColor.b + "," + borderColor.a + ")";

        context.lineWidth = borderThickness;
        roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);

        // text color
        context.fillStyle = "rgba(0, 0, 0, 1.0)";
        context.fillText(text, borderThickness, fontsize + borderThickness);

        // canvas contents will be used for a texture
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        var spriteMaterial = new THREE.SpriteMaterial(
            { map: texture} );

        var sprite = new THREE.Sprite( spriteMaterial );
        sprite.scale.set(200,100,1.0);
        this.label = sprite;
    };

    NameSprite.prototype.getLabel = function(){
        return this.label;
    };


    return NameSprite
});