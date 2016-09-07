/**
 * Created by Bonsai on 16-8-15.
 */
var require = {
    baseUrl: 'js/lib',

    shim: {
        threeCore: {exports: 'THREE'},
        FirstPersonControls: {deps: ['threeCore'], exports: 'THREE'},
        OrbitControls: {deps: ['threeCore'], exports: 'THREE'},
        threePlugin: {deps: ['threeCore'], exports: 'THREE'},

        bootstrap: {deps: ['jquery']},
        when: {exports: 'when'},
        dat: {exports: 'dat'}
    },

    paths: {
        three: 'three/three',
        threeCore: 'three/three.min',
        FirstPersonControls: 'three/FirstPersonControls',
        OrbitControls: 'three/OrbitControls',
        threePlugin: 'three/threePlugin',

        glm: 'gl-matrix-min',
        dat: 'dat.gui.min',

        jquery: 'jquery.min',
        vue: 'vue.min',
        bootstrap: 'bootstrap.min',
        when: 'when'
    }
};
