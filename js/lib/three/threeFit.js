/**
 * Created by Bonsai on 16-9-25.
 */

// when intersect one object, ray stop search, to accelerate search speed
THREE.RayCaster.prototype.intersectObjects = function ( objects, recursive ) {

    var intersects = [];

    if ( Array.isArray( objects ) === false ) {

        console.warn( 'THREE.Raycaster.intersectObjects: objects is not an Array.' );
        return intersects;

    }

    for ( var i = 0, l = objects.length; i < l; i ++ ) {

        intersectObject( objects[ i ], this, intersects, recursive );

        if (intersects.length > 0) {
            break
        }
    }

    // intersects.sort( ascSort );

    return intersects;

};