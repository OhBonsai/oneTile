/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.RenderPass = function ( scene, camera, overrideMaterial, clearColor, clearAlpha ) {

    this.scene = scene;
    this.camera = camera;

    this.overrideMaterial = overrideMaterial;

    this.clearColor = clearColor;
    this.clearAlpha = ( clearAlpha !== undefined ) ? clearAlpha : 1;

    this.oldClearColor = new THREE.Color();
    this.oldClearAlpha = 1;

    this.enabled = true;
    this.clear = true;
    this.needsSwap = false;

};

THREE.RenderPass.prototype = {

    render: function ( renderer, writeBuffer, readBuffer, delta ) {

        this.scene.overrideMaterial = this.overrideMaterial;

        if ( this.clearColor ) {

            this.oldClearColor.copy( renderer.getClearColor() );
            this.oldClearAlpha = renderer.getClearAlpha();

            renderer.setClearColor( this.clearColor, this.clearAlpha );

        }

        renderer.render( this.scene, this.camera, readBuffer, this.clear );

        if ( this.clearColor ) {

            renderer.setClearColor( this.oldClearColor, this.oldClearAlpha );

        }

        this.scene.overrideMaterial = null;

    }

};


/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.ShaderPass = function ( shader, textureID ) {

    this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse";

    this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

    this.material = new THREE.ShaderMaterial( {

        uniforms: this.uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader

    } );

    this.renderToScreen = false;

    this.enabled = true;
    this.needsSwap = true;
    this.clear = false;

};

THREE.ShaderPass.prototype = {

    render: function ( renderer, writeBuffer, readBuffer, delta ) {

        if ( this.uniforms[ this.textureID ] ) {

            this.uniforms[ this.textureID ].value = readBuffer;

        }

        THREE.EffectComposer.quad.material = this.material;

        if ( this.renderToScreen ) {

            renderer.render( THREE.EffectComposer.scene, THREE.EffectComposer.camera );

        } else {

            renderer.render( THREE.EffectComposer.scene, THREE.EffectComposer.camera, writeBuffer, this.clear );

        }

    }

};


/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.MaskPass = function ( scene, camera ) {

    this.scene = scene;
    this.camera = camera;

    this.enabled = true;
    this.clear = true;
    this.needsSwap = false;

    this.inverse = false;

};

THREE.MaskPass.prototype = {

    render: function ( renderer, writeBuffer, readBuffer, delta ) {

        var context = renderer.context;

        // don't update color or depth

        context.colorMask( false, false, false, false );
        context.depthMask( false );

        // set up stencil

        var writeValue, clearValue;

        if ( this.inverse ) {

            writeValue = 0;
            clearValue = 1;

        } else {

            writeValue = 1;
            clearValue = 0;

        }

        context.enable( context.STENCIL_TEST );
        context.stencilOp( context.REPLACE, context.REPLACE, context.REPLACE );
        context.stencilFunc( context.ALWAYS, writeValue, 0xffffffff );
        context.clearStencil( clearValue );

        // draw into the stencil buffer

        renderer.render( this.scene, this.camera, readBuffer, this.clear );
        renderer.render( this.scene, this.camera, writeBuffer, this.clear );

        // re-enable update of color and depth

        context.colorMask( true, true, true, true );
        context.depthMask( true );

        // only render where stencil is set to 1

        context.stencilFunc( context.EQUAL, 1, 0xffffffff );  // draw if == 1
        context.stencilOp( context.KEEP, context.KEEP, context.KEEP );

    }

};


THREE.ClearMaskPass = function () {

    this.enabled = true;

};

THREE.ClearMaskPass.prototype = {

    render: function ( renderer, writeBuffer, readBuffer, delta ) {

        var context = renderer.context;

        context.disable( context.STENCIL_TEST );

    }

};

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.EffectComposer = function ( renderer, renderTarget ) {

    this.renderer = renderer;

    if ( renderTarget === undefined ) {

        var width = window.innerWidth || 1;
        var height = window.innerHeight || 1;
        var parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };

        renderTarget = new THREE.WebGLRenderTarget( width, height, parameters );

    }

    this.renderTarget1 = renderTarget;
    this.renderTarget2 = renderTarget.clone();

    this.writeBuffer = this.renderTarget1;
    this.readBuffer = this.renderTarget2;

    this.passes = [];

    if ( THREE.CopyShader === undefined )
        console.error( "THREE.EffectComposer relies on THREE.CopyShader" );

    this.copyPass = new THREE.ShaderPass( THREE.CopyShader );

};

THREE.EffectComposer.prototype = {

    swapBuffers: function() {

        var tmp = this.readBuffer;
        this.readBuffer = this.writeBuffer;
        this.writeBuffer = tmp;

    },

    addPass: function ( pass ) {

        this.passes.push( pass );

    },

    insertPass: function ( pass, index ) {

        this.passes.splice( index, 0, pass );

    },

    render: function ( delta ) {

        this.writeBuffer = this.renderTarget1;
        this.readBuffer = this.renderTarget2;

        var maskActive = false;

        var pass, i, il = this.passes.length;

        for ( i = 0; i < il; i ++ ) {

            pass = this.passes[ i ];

            if ( !pass.enabled ) continue;

            pass.render( this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive );

            if ( pass.needsSwap ) {

                if ( maskActive ) {

                    var context = this.renderer.context;

                    context.stencilFunc( context.NOTEQUAL, 1, 0xffffffff );

                    this.copyPass.render( this.renderer, this.writeBuffer, this.readBuffer, delta );

                    context.stencilFunc( context.EQUAL, 1, 0xffffffff );

                }

                this.swapBuffers();

            }

            if ( pass instanceof THREE.MaskPass ) {

                maskActive = true;

            } else if ( pass instanceof THREE.ClearMaskPass ) {

                maskActive = false;

            }

        }

    },

    reset: function ( renderTarget ) {

        if ( renderTarget === undefined ) {

            renderTarget = this.renderTarget1.clone();

            renderTarget.width = window.innerWidth;
            renderTarget.height = window.innerHeight;

        }

        this.renderTarget1 = renderTarget;
        this.renderTarget2 = renderTarget.clone();

        this.writeBuffer = this.renderTarget1;
        this.readBuffer = this.renderTarget2;

    },

    setSize: function ( width, height ) {

        var renderTarget = this.renderTarget1.clone();

        renderTarget.width = width;
        renderTarget.height = height;

        this.reset( renderTarget );

    }

};

// shared ortho camera

THREE.EffectComposer.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

THREE.EffectComposer.quad = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), null );

THREE.EffectComposer.scene = new THREE.Scene();
THREE.EffectComposer.scene.add( THREE.EffectComposer.quad );


/**
 * ThickLineShader
 * @author Garcia Hurtado (ghurtado@gmail.com)
 *
 * This post filter emulates line thickness by applying a full screen pass to geometry
 * rendered in wireframe mode. It is meant to be applied to a scene containing only
 * "flat geometry" with edges being shown (ie: no textures or lighting);
 *
 * The idea / algorithm was inspired by the ThreeJS blur filters.
 *
 * The shader accepts an "edgeWidth" parameter, which determines the total number of
 * "passes", or copies of the textures which are all drawn 1px away from one another,
 * in both the vertical and horizontal axis. This creates the illusion of a solid
 * line of variable thickness.
 *
 * Parameters:
 *
 *	tDiffuse: Standard 2D texture sampler. Will automatically be set to your prefilter
 * 			full rendered scene by THREE.js
 *
 *	edgeWidth: Thickness of the resulting lines (in pixels)
 *
 *	diagOffset: When 0, the shader will do one fully horizontal copy and one fully vertical copy
 * 			of the scene for each pixel of the line width. Set to one to rotate the copies by 45 degrees
 *			This should help terminate the line caps nicely with diagonal fills.
 *
 *	totalWidth: Total width of the rendered scene (in pixels)
 *	totalHeight: Total height of the rendered scene (in pixels)
 *
 * --
 * Inspired by https://github.com/mrdoob/three.js/blob/master/examples/js/shaders/HorizontalBlurShader.js
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */
THREE.ThickLineShader = {

    uniforms: {
        "tDiffuse": { type: "t", value: null },
        "edgeWidth": {type: "i", value: 1},
        "diagOffset": {type: "i", value: 0},
        "totalWidth": { type: "f", value: null },
        "totalHeight": { type: "f", value: null }
    },

    vertexShader: [
        "varying vec2 vUv;",

        "void main() {",
        "vUv = uv;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "}"

    ].join("\n"),

    fragmentShader: [
        "uniform sampler2D tDiffuse;",
        "uniform int edgeWidth;",
        "uniform int diagOffset;",
        "uniform float totalWidth;",
        "uniform float totalHeight;",
        "const int MAX_LINE_WIDTH = 30;", // Needed due to weird limitations in GLSL around for loops
        "varying vec2 vUv;",

        "void main() {",
        "int offset = int( floor(float(edgeWidth) / float(2) + 0.5) );",
        "vec4 color = vec4( 0.0, 0.0, 0.0, 0.0);",

        // Horizontal copies of the wireframe first
        "for (int i = 0; i < MAX_LINE_WIDTH; i++) {",
        "float uvFactor = (float(1) / totalWidth);",
        "float newUvX = vUv.x + float(i - offset) * uvFactor;",
        "float newUvY = vUv.y + (float(i - offset) * float(diagOffset) ) * uvFactor;",  // only modifies vUv.y if diagOffset > 0
        "color = max(color, texture2D( tDiffuse, vec2( newUvX,  newUvY  ) ));	",
        // GLSL does not allow loop comparisons against dynamic variables. Workaround below
        "if(i == edgeWidth) break;",
        "};",

        // Now we create the vertical copies
        "for (int i = 0; i < MAX_LINE_WIDTH; i++) {",
        "float uvFactor = (float(1) / totalHeight);",
        "float newUvX = vUv.x + (float(i - offset) * float(-diagOffset) ) * uvFactor;", // only modifies vUv.x if diagOffset > 0
        "float newUvY = vUv.y + float(i - offset) * uvFactor;",
        "color = max(color, texture2D( tDiffuse, vec2( newUvX, newUvY ) ));	",
        "if(i == edgeWidth) break;",
        "};",

        "gl_FragColor = color;",

        "}"

    ].join("\n")

};



/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

THREE.CopyShader = {

    uniforms: {

        "tDiffuse": { type: "t", value: null },
        "opacity":  { type: "f", value: 1.0 }

    },

    vertexShader: [

        "varying vec2 vUv;",

        "void main() {",

        "vUv = uv;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

        "}"

    ].join("\n"),

    fragmentShader: [

        "uniform float opacity;",

        "uniform sampler2D tDiffuse;",

        "varying vec2 vUv;",

        "void main() {",

        "vec4 texel = texture2D( tDiffuse, vUv );",
        "gl_FragColor = opacity * texel;",

        "}"

    ].join("\n")

};
