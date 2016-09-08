/**
 * Created by Bonsai on 16-8-23.
 */
define(['glm'], function (glm) {
    'use strict';

    var v2 = glm.vec2;

    var lineA = [0, 0];
    var lineB = [0, 0];
    var tangent = [0, 0];
    var miter = [0, 0];

    function computeMiter(tangent, miter, lineA, lineB, halfThick){
        // get tangent line
        var tmp = [0, 0];
        v2.add(tangent, lineA, lineB);
        v2.normalize(tangent, tangent);

        // get miter as a unit vector
        v2.set(miter, -tangent[1], tangent[0]);
        v2.set(tmp, -lineA[1], lineA[0]);

        // get the necessary length of our miter
        return halfThick / v2.dot(miter, tmp)
    }

    function normal(out, dir) {
        // get perpendicular
        v2.set(out, -dir[1], dir[0]);
        return out
    }

    function direction(out, a, b) {
        // get unit dir of two lines
        v2.subtract(out, a, b);
        v2.normalize(out, out);
        return out
    }

    function addNext(out, normal, length) {
        out.push([[normal[0], normal[1]], length]);
    }


    return {
        // get normal direction to increase line width
        getNormals : function(points, closed){
            var lineA = [0, 0];
            var lineB = [0, 0];
            var tangent = [0, 0];
            var miter = [0, 0];
            var curNormal = null;
            var out = [];
            if (closed) {
                points = points.slice();
                points.push(points[0]);
            }

            var total = points.length;
            for (var i=1; i<total; i++) {
                var last = points[i-1];
                var cur = points[i];
                var next = i<points.length-1 ? points[i+1] : null;

                direction(lineA, cur, last);
                if (!curNormal)  {
                    curNormal = [0, 0];
                    normal(curNormal, lineA)
                }

                if (i === 1) //add initial normals
                    addNext(out, curNormal, 1);

                if (!next) { //no miter, simple segment
                    normal(curNormal, lineA);//reset normal
                    addNext(out, curNormal, 1)
                } else { //miter with last
                    //get unit dir of next line
                    direction(lineB, next, cur);

                    //stores tangent & miter
                    var miterLen = computeMiter(tangent, miter, lineA, lineB, 1);
                    addNext(out, miter, miterLen)
                }
            }

            //if the polyline is a closed loop, clean up the last normal
            if (points.length > 2 && closed) {
                var last2 = points[total-2];
                var cur2 = points[0];
                var next2 = points[1];

                direction(lineA, cur2, last2);
                direction(lineB, next2, cur2);
                normal(curNormal, lineA);

                var miterLen2 = computeMiter(tangent, miter, lineA, lineB, 1);
                out[0][0] = miter.slice();
                out[total-1][0] = miter.slice();
                out[0][1] = miterLen2;
                out[total-1][1] = miterLen2;
                out.pop()
            }

            return out
        },
        
        // out circle path point
        arc: function(x, y, radius, start, end, clockwise, steps, path) {
            if (!path){
                path = [];
            }
                

            x = x||0;
            y = y||0;
            radius = radius||0;
            start = start||0;
            end = end||0;

            //determine distance between the two angles
            //...probably a nicer way of writing this
            var dist = Math.abs(start-end);
            if (!clockwise && start > end)
                dist = 2*Math.PI - dist;
            else if (clockwise && end > start)
                dist = 2*Math.PI - dist;

            //approximate the # of steps using the cube root of the radius
            if (typeof steps !== 'number')
                steps = Math.max(6, Math.floor(6 * Math.pow(radius, 1/3) * (dist / (Math.PI))));

            //ensure we have at least 3 steps..
            steps = Math.max(steps, 3);

            var f = dist / (steps),
                t = start;

            //modify direction
            f *= clockwise ? -1 : 1;

            for (var i=0; i<steps+1; i++) {
                var cs = Math.cos(t),
                    sn = Math.sin(t);

                var nx = x + cs*radius,
                    ny = y + sn*radius;

                path.push([ nx, ny ]);

                t += f
            }
            return path
        }
    }

});