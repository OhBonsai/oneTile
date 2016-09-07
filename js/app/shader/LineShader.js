/**
 * Created by Bonsai on 16-9-7.
 */
define(['three'],function(THREE){
    'use strict';

    var LineShader = function(opt){
        opt = opt || {};
        var thickness = typeof opt.thickness === 'number' ? opt.thickness : 0.1;
        var opacity = typeof opt.opacity === 'number' ? opt.opacity : 1.0;
        var diffuse = typeof opt.diffuse !== 'null' ? opt.diffuse : 0xffffff;

        delete opt.thickness;
        delete opt.opacity;
        delete opt.diffuse;

        var ret = Object.assign({
            uniforms: {
                thickness: {type:'f', value: thickness},
                opacity: {type:'f', value: opacity},
                diffuse: {type:'c', value: new THREE.Color(diffuse)}
            },

            vertexShader: function(){/*
                uniform float thickness;
                attribute float lineMiter;
                attribute vec2 lineNormal;
                void main() {
                    vec3 pointPos = position.xyz + vec3(lineNormal*thickness/2.0*lineMiter, 0.0);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pointPos, 1.0);
                }
            */}.toString().match(/[^]*\/\*([^]*)\*\/}$/)[1],

            fragmentShader: function(){/*
                uniform vec3 diffuse;
                uniform float opacity;
                void main(){
                    gl_FragColor = vec4(diffuse, opacity);
                }
            */}.toString().match(/[^]*\/\*([^]*)\*\/}$/)[1]
    }, opt);

        return ret
    };

    return LineShader
});