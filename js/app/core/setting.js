/**
 * Created by Bonsai on 16-8-22.
 */
define([], function(){
    'use strict';

    var SETTING = {
        /** road shape painter **/
        RSP: {
            STANDARD_ROAD: 1
        },

        /** features init status **/
        FIS: {
            Links: true,
            Nodes: false,
            Builds: false,
            Names: true
        },

        /** 3D object Bonsai type **/
        BTP: {
            Link: 'Link',
            Node: 'Node',
            Name: 'Name',
            Build: 'Build'
        },

        /** 3D object group name **/
        GN: {
            Links: 'Links',
            Nodes: 'Nodes',
            Names: 'Names',
            Builds: 'Builds'
        }

    };

    return SETTING;
});