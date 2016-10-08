/**
 * Created by Bonsai on 16-10-8.
 */
define(['three', './LineGeometry', '../util/util'], function(THREE, LineGeometry, U){
   'use strict';

    /*
     * this class extend THREE.MESH to fix rayCast can't intersect lineMesh
     */
    var LineMesh = function(geometry, material){
        if (!(geometry instanceof LineGeometry)) {
            throw new U.DeveloperError('LineMesh must match LineGeo')
        }

        THREE.Mesh.call(this, geometry, material);
        this.type = 'LineMesh';
    };

    LineMesh.prototype = Object.assign( Object.create( THREE.Mesh.prototype ), {

        constructor: LineMesh,

        raycast :   ( function () {

            var inverseMatrix = new THREE.Matrix4();
            var ray = new THREE.Ray();
            var sphere = new THREE.Sphere();

            return function raycast( raycaster, intersects ) {

                var precision = raycaster.linePrecision;
                var precisionSq = precision * precision;

                var geometry = this.geometry;
                var matrixWorld = this.matrixWorld;

                // Checking boundingSphere distance to ray
                if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();

                sphere.copy( geometry.boundingSphere );
                sphere.applyMatrix4( matrixWorld );

                if ( raycaster.ray.intersectsSphere( sphere ) === false ) return;

                inverseMatrix.getInverse( matrixWorld );
                ray.copy( raycaster.ray ).applyMatrix4( inverseMatrix );

                var vStart = new THREE.Vector3();
                var vEnd = new THREE.Vector3();
                var interSegment = new THREE.Vector3();
                var interRay = new THREE.Vector3();
                var step = 1;

                var index = geometry.index;
                var attributes = geometry.attributes;
                var positions = attributes.position.array;

                if ( index !== null ) {
                    var indices = index.array;
                    for ( var i = 0, l = indices.length - 1; i < l; i += step ) {

                        var a = indices[ i ];
                        var b = indices[ i + 1 ];

                        vStart.fromArray( positions, a * 3 );
                        vEnd.fromArray( positions, b * 3 );

                        var distSq = ray.distanceSqToSegment( vStart, vEnd, interRay, interSegment );

                        if ( distSq > precisionSq ) continue;

                        interRay.applyMatrix4( this.matrixWorld ); //Move back to world space for distance calculation

                        var distance = raycaster.ray.origin.distanceTo( interRay );

                        if ( distance < raycaster.near || distance > raycaster.far ) continue;

                        intersects.push( {
                            distance: distance,
                            point: interSegment.clone().applyMatrix4( this.matrixWorld ),
                            index: i,
                            face: null,
                            faceIndex: null,
                            object: this
                        } );

                    }

                }


            };

        }() )
    } );


    return LineMesh
});