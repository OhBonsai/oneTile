/**
 * Created by Bonsai on 16-9-9.
 */
define([
    './LineDashShader',
    './LineShader',
    './LineGradientShader',
    './skyDomeShader'
],function(
    LineDashShader,
    LineShader,
    LineGradientShader,
    skyDomeShader
){
    return {
        line: {
            LineDashShader: LineDashShader,
            LineShader: LineShader,
            LineGradientShader: LineGradientShader
        },
        env: {
            skyDomeShader: skyDomeShader
        }
    } 
});