/**
 * Created by Bonsai on 16-9-20.
 */
define(['three','../util/util'], function(THREE, U){
    'use strict';

    /*
     * very simple building class extends THREE.Object3D
     * pointList,height are provided by map group data.
     *
     */
    var Builder1Geometry = function(pointList, height, triList){
        if (!(this instanceof Builder1Geometry)){
            return new Builder1Geometry(pointList, height, triList)
        }

        THREE.BufferGeometry.call(this);

        if(!Array.isArray(pointList)){
            throw new U.DevelopError('must input a array when you create BuilderGeometry');
            return new THREE.BufferGeometry()
        }

        this.addAttribute('position', new THREE.BufferAttribute(null, 3));
        this.setIndex(new THREE.BufferAttribute(null, 1));

        this.update(pointList, height, triList);
    };

    Builder1Geometry.prototype = Object.assign(Object.create(THREE.BufferGeometry.prototype),{
        constructor: Builder1Geometry,

        update: function(pointList, height, triList){
            pointList = pointList || [];

            //close building
            pointList.push(pointList[0]);

            var count = pointList.length * 2;

            var attrPosition = this.getAttribute('position');
            var attrIndex = this.getIndex();

            attrPosition.array = new Float32Array(count * 3);
            attrIndex.array = new Uint16Array(count*3 -6 + triList.length * 3);

            var index = 0;
            var c = 0;
            var indexArray = attrIndex.array;

            // facade of building
            pointList.forEach(function(point){
                var i = index;
                indexArray[c++] = i+0;
                indexArray[c++] = i+1;
                indexArray[c++] = i+2;
                indexArray[c++] = i+2;
                indexArray[c++] = i+1;
                indexArray[c++] = i+3;

                attrPosition.setXYZ(index++, point[0], point[1], height*5+0.0);
                attrPosition.setXYZ(index++, point[0], point[1], 2.0);
            });

            c -= 6;

            triList.forEach(function(tri){
                indexArray[c++] = tri[0]*2;
                indexArray[c++] = tri[1]*2;
                indexArray[c++] = tri[2]*2;
            });



        }
    });

    return Builder1Geometry
});