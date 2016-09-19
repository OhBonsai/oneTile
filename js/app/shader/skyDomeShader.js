/**
 * Created by Bonsai on 16-9-9.
 */
define(['three'],function(THREE){
    return {
        uniforms : {
            texture: { type: 't', value: THREE.TextureLoader('./textures/universe.jpg') }
        },
        vertexShader: function(){/*
            varying vec2 vUV;
            
            void main() {  
                vUV = uv;
                vec4 pos = vec4(position, 1.0);
                gl_Position = projectionMatrix * modelViewMatrix * pos;
            }
        */}.toString().match(/[^]*\/\*([^]*)\*\/}$/)[1],
        fragmentShader: function(){/*
            uniform sampler2D texture;  
            varying vec2 vUV;
            
            void main() {  
                vec4 sample = texture2D(texture, vUV);
                gl_FragColor = vec4(sample.xyz, sample.w);
            }
        */}.toString().match(/[^]*\/\*([^]*)\*\/}$/)[1]
    }
});