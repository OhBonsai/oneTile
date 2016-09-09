/**
 * Created by Bonsai on 16-9-9.
 */
define(['three', '../util/__init__'],function(THREE, U) {
    'use strict';

    var LineGradientShader = function(opt){
        opt = opt || {};

        var ret = Object.assign({
            transparent: true,
            uniforms: {
                thickness: { type: 'f', value: U.defaulted.num(opt.thickness, 20) },
                opacity: { type: 'f', value: U.defaulted.num(opt.opacity, 1.0) },
                diffuse: { type: 'c', value: new THREE.Color(opt.diffuse || 0xcccccc) },
                time: { type: 'f', value: 0}
            },

            vertexShader: function(){/*
             uniform float thickness;
             attribute float lineMiter;
             attribute vec2 lineNormal;
             attribute float lineDistance;

             varying float lineU;
             varying float edge;

             void main() {
                edge = sign(lineMiter);
                lineU = lineDistance;
                vec3 pointPos = position.xyz + vec3(lineNormal*thickness/2.0*lineMiter, 0.0);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pointPos, 1.0);
             }
             */}.toString().match(/[^]*\/\*([^]*)\*\/}$/)[1],

            fragmentShader: function(){/*
             uniform vec3 diffuse;
             uniform float opacity;
             uniform float time;

             varying float lineU;
             varying float edge;

             void main(){
                float lineV = 1.0 - abs(edge);
                lineV = smoothstep(0.0,0.8,lineV);
                float radial = lineU * sin(time+lineU*2.0);
                gl_FragColor = vec4(vec3(lineV), 1.0);
                gl_FragColor.a = opacity * radial * lineV;
             }
             */}.toString().match(/[^]*\/\*([^]*)\*\/}$/)[1]
        }, opt);

        delete ret.diffuse;
        delete ret.opacity;
        delete ret.thickness;

        return ret
    };

    return LineGradientShader

});