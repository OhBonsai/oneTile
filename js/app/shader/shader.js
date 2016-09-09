/**
 * Created by Bonsai on 16-9-9.
 */
define([
    './LineDashShader',
    './LineShader',
    './LineGradientShader'
],function(
    LineDashShader,
    LineShader,
    LineGradientShader
){
    return {
        line: {
            LineDashShader: LineDashShader,
            LineShader: LineShader,
            LineGradientShader: LineGradientShader
        }
    } 
});