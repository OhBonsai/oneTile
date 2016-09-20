/**
 * Created by Bonsai on 16-9-8.
 */
define(['three', '../util/__init__'],function(THREE, U) {
    'use strict';

    var LineDashShader = function(opt){
        opt = opt || {};

        var ret = Object.assign({
            transparent: true,
            uniforms: {
                thickness: { type: 'f', value: U.defaulted.num(opt.thickness, 20) },
                opacity: { type: 'f', value: U.defaulted.num(opt.opacity, 1.0) },
                diffuse: { type: 'c', value: new THREE.Color(opt.diffuse) },
                dashSteps: { type: 'f', value: 12 },
                dashDistance: { type: 'f', value: 0.0 },
                dashSmooth: { type: 'f', value: 0.2 }
            },

            vertexShader: function(){/*
                 uniform float thickness;
                 attribute float lineMiter;
                 attribute vec2 lineNormal;

                 attribute float lineDistance;
                 varying float lineU;
                 void main() {
                     lineU = lineDistance;
                     vec3 pointPos = position.xyz + vec3(lineNormal*thickness/2.0*lineMiter, 0.0);
                     gl_Position = projectionMatrix * modelViewMatrix * vec4(pointPos, 1.0);
                 }
            */}.toString().match(/[^]*\/\*([^]*)\*\/}$/)[1],

            fragmentShader: function(){/*
                uniform vec3 diffuse;
                uniform float opacity;
                uniform float dashSteps;
                uniform float dashDistance;
                uniform float dashSmooth;

                varying float lineU;

                void main(){
                    float lineUMod = mod(lineU, 1.0/dashSteps) * dashSteps;;
                    float dash = smoothstep(dashDistance, dashDistance+dashSmooth, length(lineUMod-0.5));
                    gl_FragColor = vec4(vec3(dash), opacity*dash);
                }
            */}.toString().match(/[^]*\/\*([^]*)\*\/}$/)[1]
        }, opt);

        delete ret.diffuse;
        delete ret.opacity;
        delete ret.thickness;

        return ret
    };
    
    return LineDashShader

});