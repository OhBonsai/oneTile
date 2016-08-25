/**
 * Created by Bonsai on 16-8-23.
 */
define([], function () {
    'use strict';

    var isPointInPolygen = function (x, y, polyX, polyY) {
        var oddTransitions = false;
        var polySides = polyX.length;

        for (var i = 0, j = polySides - 1; i < polySides; j = i++) {
            if (( polyY[i] < y && polyY[j] >= y ) || ( polyY[j] < y && polyY[i] >= y )) {
                if (polyX[i] + ( y - polyY[i] ) / ( polyY[j] - polyY[i] ) * ( polyX[j] - polyX[i] ) < x) {
                    oddTransitions = !oddTransitions;
                }
            }
        }
        return oddTransitions;
    };


    var getPointInNormalDirection = function (x1, y1, x2, y2, BLength, polyX, polyY) {
        //     p2
        //     |\
        //     |b\
        //     |  \
        //    A|   \C
        //     |    \
        //     |c___a\
        //    p1  B   p3
        //    p1,p1 is our shape point
        //    B is half of road width
        var slopeA = (y2 - y1) / (x2 - x1);
        var slopeB = -1.0 / slopeA;
        var diffX = BLength * ( 1 / Math.sqrt(1 + slopeB * slopeB));
        var diffY = BLength * ( slopeB / Math.sqrt(1 + slopeB * slopeB));
        
        var posX = x1 + diffX;
        var posY = y1 + diffY;
        var negX = x1 - diffX;
        var negY = y1 - diffY;

        if (!isPointInPolygen(posX, posY, polyX, polyY)) {
            return {
                outerX: posX, outerY: posY,
                innerX: negX, innerY: negY
            }
        } else {
            if (isPointInPolygen(negX, negY, polyX, polyY)){
                console.log('i can not believe it happens');
                console.log(posX+','+posY+','+negX+','+negY);
                console.log(polyX);
                console.log(polyY);
            }
            return {
                outerX: negX, outerY: negY,
                innerX: posX, innerY: posY
            }
        }
        
        
    };


    var checkLineIntersection = function (line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
        var denominator, a, b, numerator1, result = {
            x: null,
            y: null
        };

        denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) -
            ((line2EndX - line2StartX) * (line1EndY - line1StartY));
        if (denominator == 0) {
            return result;
        }
        a = line1StartY - line2StartY;
        b = line1StartX - line2StartX;

        numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
        a = numerator1 / denominator;

        result.x = line1StartX + (a * (line1EndX - line1StartX));
        result.y = line1StartY + (a * (line1EndY - line1StartY));

        return result;
    };


    var getTwoLineNormalIntersection = function (xs, ys, xm, ym, xe, ye) {
        var slopeNormal01 = (xs - xm) / (ym - ys);
        var slopeNormal12 = (xe - xm) / (ym - ye);


        if (slopeNormal01 == slopeNormal12) {
            return {x: xs, y: ys}
        }

        //  normal line - x axis intersection
        var x1 = xs;
        var y1 = ys;
        var x2 = 0;
        var y2 = ys - slopeNormal01 * xs;
        var x3 = xe;
        var y3 = ye;
        var x4 = 0;
        var y4 = ye - slopeNormal12 * xe;

        if (slopeNormal01 == 0) {
            x2 = x1 / 2 + 1;
            y2 = y1;
        }
        if (slopeNormal12 == 0) {
            x4 = x3 / 2 + 1;
            y4 = y3;
        }
        if (Math.abs(slopeNormal01) == Infinity) {
            x2 = x1;
            y2 = y1 / 2 + 1;
        }
        if (Math.abs(slopeNormal12) == Infinity) {
            x4 = x3;
            y4 = y3 / 2 + 1;
        }

        return checkLineIntersection(x1, y1, x2, y2, x3, y3, x4, y4)

    };


    return {
        convertShapePoint2Vertex: function (shapePointArray, roadWidth) {
            var distance = roadWidth / 2;
            var polyX = [];
            var polyY = [];

            for (var i=0; i<shapePointArray.length; i+=2){
                polyX.push(shapePointArray[i]);
                polyY.push(shapePointArray[i+1]);
            }

            var roadVerPosArr = [];
            var roadVerNegArr = [];

            // first point
            var firstPointVertex = getPointInNormalDirection(shapePointArray[0], shapePointArray[1],
                shapePointArray[2], shapePointArray[3], distance, polyX, polyY);

            roadVerPosArr.push(firstPointVertex.outerX);
            roadVerPosArr.push(firstPointVertex.outerY);
            roadVerNegArr.push(firstPointVertex.innerX);
            roadVerNegArr.push(firstPointVertex.innerY);

            // point neither first nor last
            for (var i = 2; i < shapePointArray.length - 2; i += 2) {
                var priorSegmentVertex = getPointInNormalDirection(shapePointArray[i], shapePointArray[i + 1],
                    shapePointArray[i - 2], shapePointArray[i - 1], distance, polyX, polyY);
                var secondarySegmentVertex = getPointInNormalDirection(shapePointArray[i], shapePointArray[i + 1],
                    shapePointArray[i + 2], shapePointArray[i + 3], distance, polyX, polyY);

                var posVertex = getTwoLineNormalIntersection(
                    priorSegmentVertex.outerX, priorSegmentVertex.outerY,
                    shapePointArray[i], shapePointArray[i + 1],
                    secondarySegmentVertex.outerX, secondarySegmentVertex.outerY);

                var negVertex = getTwoLineNormalIntersection(
                    priorSegmentVertex.innerX, priorSegmentVertex.innerY,
                    shapePointArray[i], shapePointArray[i + 1],
                    secondarySegmentVertex.innerX, secondarySegmentVertex.innerY);

                roadVerPosArr.push(posVertex.x);
                roadVerPosArr.push(posVertex.y);
                roadVerNegArr.push(negVertex.x);
                roadVerNegArr.push(negVertex.y);
            }

            // last point
            var endVertexPoints = getPointInNormalDirection(shapePointArray[shapePointArray.length - 2],
                shapePointArray[shapePointArray.length - 1],
                shapePointArray[shapePointArray.length - 4],
                shapePointArray[shapePointArray.length - 3],
                distance, polyX, polyY);

            roadVerPosArr.push(endVertexPoints.outerX);
            roadVerPosArr.push(endVertexPoints.outerY);
            roadVerNegArr.push(endVertexPoints.innerX);
            roadVerNegArr.push(endVertexPoints.innerY);

            for (var i = roadVerNegArr.length - 2; i >= 0; i -= 2) {
                roadVerPosArr.push(roadVerNegArr[i]);
                roadVerPosArr.push(roadVerNegArr[i + 1]);
            }

            return roadVerPosArr
        }
    }

});