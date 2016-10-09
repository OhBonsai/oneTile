/**
 * Created by Bonsai on 16-9-24.
 */
define(['../ray', '../camera', '../scene', '../renderer', 'three', '../util/util', 'tween'],
function(ray, camera, scene, renderer, THREE, U, TWEEN){
    'use strict';

    var mouse = new THREE.Vector2();

    var ascSort = function( a, b ) {
        return a.distance - b.distance;
    };

    var moveCamera = function (obj) {
        var from = camera.position.clone();

        var to = {
            x: obj.position.x - 200,
            y: obj.position.y,
            z: 400
        };
        var tween = new TWEEN.Tween(from)
            .to(to, 2000)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function () {
                camera.position.set(this.x, this.y, this.z);
                camera.lookAt(new THREE.Vector3(0, 0, 0));
                // camera.lookAt(obj.position)
            })
            .onComplete(function () {
                camera.lookAt(new THREE.Vector3(0, 0, 0));
                // camera.lookAt(obj.position)
            })
            .start();
    };

    var onMouseDbl = function(event, marker) {
        event.preventDefault();

        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        ray.setFromCamera( mouse, camera );
        var allInterSects = [];
        for (var idx in marker._markableTypes){
            var groupName = marker._markableTypes[idx];
            if (scene.getObjectByName(groupName).visible){
                var intersects = ray.intersectObjects( scene.getObjectByName(groupName).children);
                if (intersects.length > 0){
                    allInterSects.push(intersects[0])
                }
            }
        }
        allInterSects.sort(ascSort);
        if (U.defined(allInterSects[0])) {
            marker.mark(allInterSects[0].object);
            moveCamera(allInterSects[0].object);
        }
    };

    // need keep a reference of mouse dbl handler, Or else, can't remove this listener
    var dirtyFunc = null;

    // mark action dict 
    var markActions = {
        markLink: function (obj) {
            if (obj.bonsaiType !== 'Link') throw new U.DevelopError('mark a wrong bonsaiType obj');
            obj.material.uniforms.diffuse.value = new THREE.Color(1, 0, 0);
        },

        unMarkLink: function (obj) {
            if (obj.bonsaiType !== 'Link') throw new U.DevelopError('mark a wrong bonsaiType obj');
            obj.material.uniforms.diffuse.value = new THREE.Color(1, 1, 1);
        },

        markName: function (obj) {
            if (obj.bonsaiType !== 'Name') throw new U.DevelopError('mark a wrong bonsaiType obj');
            obj.material.color = new THREE.Color(1, 0, 0);
        },

        unMarkName: function (obj) {
            if (obj.bonsaiType !== 'Name') throw new U.DevelopError('mark a wrong bonsaiType obj');
            obj.material.color = new THREE.Color(1, 1, 1);
        },

        markBuild: function (obj) {
            if (obj.bonsaiType !== 'Build') throw new U.DevelopError('mark a wrong bonsaiType obj');
            obj.material.color = new THREE.Color(1, 0, 0);
        },

        unMarkBuild: function (obj) {
            if (obj.bonsaiType !== 'Build') throw new U.DevelopError('mark a wrong bonsaiType obj');
            obj.material.color = new THREE.Color(0xB0DCD5); //0x156289
        },

        markNode: function (obj) {
            if (obj.bonsaiType !== 'Node') throw new U.DevelopError('mark a wrong bonsaiType obj');
            obj.material.color = new THREE.Color(1, 0, 0);
        },

        unMarkNode: function (obj) {
            if (obj.bonsaiType !== 'Node') throw new U.DevelopError('mark a wrong bonsaiType obj');
            obj.material.color = new THREE.Color(0, 0, 0);
        }
    };
    
    
    var ObjectMarker = function(isMultiMarker, markableTypes){
        this._activeObjectsNo = [];
        this._markableTypes = markableTypes || ['Links', 'Nodes', 'Builds', 'Names'];
        this._isMultitMarker = U.defined(isMultiMarker) ? isMultiMarker : false;
        this._listeners = {};

        this.activate();
    };


    Object.assign(ObjectMarker.prototype, {
        construct: ObjectMarker,

        bind : function(event, handler){
            var self = this;

            if( !self._listeners[event]) self._listeners[event] = [];
            self._listeners[event].push(handler);
            return self
        },

        unbind : function(event, handler){
            var self = this;

            if (!U.defined(self._listeners[event])) return self;

            if (!U.defined(handler)) {
                self._listeners[event] = null;
                return self
            }

            if (self._listeners[event].indexOf(handler) > -1){
                self._listeners[event].splice(handler, 1);
            }
            return self
        },

        notify : function(event, data, member) {
            var self = this;

            var l = self._listeners[ event ];
            if ( ! l ) return;

            if ( ! member ) {
                for ( var i = 0; i < l.length; i ++ ) {
                    l[ i ]( data );
                }

            }
        },
        
        activate: function(){
            var self = this;

            dirtyFunc = function(event){onMouseDbl.call(this, event, self)};
            renderer.domElement.addEventListener('dblclick', dirtyFunc , false);
        },
        
        deactivate: function(){
            renderer.domElement.removeEventListener('dblclick', dirtyFunc, false);
        },

        addMakableType: function(typeName){
            if (this.makableType.indexOf(typeName) == -1) {
                this.makableType.push(typeName);
            }
        },

        removeMakableType: function(typeName){
            if (this.makableType.indexOf(typeName) != -1){
                this.makableType.remove(typeName);
            }
        },

        toggleMultiMarker: function(){
            this._isMultitMarker = !this._isMultitMarker;
        },

        mark: function(obj){
            var self = this;
            if(self._isMultitMarker){
                self._activeObjectsNo.push(obj.id)
            }else{
                if (self._activeObjectsNo.length > 0) {
                    var lastMarkObj = scene.getObjectById(self._activeObjectsNo[0]);
                    markActions['unMark'+ lastMarkObj.bonsaiType](lastMarkObj);
                }
                self._activeObjectsNo = [obj.id]
            }

            switch (obj.bonsaiType){
                case 'Link':
                    self.notify('markLink', obj);
                    markActions.markLink(obj);
                    break;
                case 'Build':
                    self.notify('markBuild', obj);
                    markActions.markBuild(obj);
                    break;
                case 'Name':
                    self.notify('markName', obj);
                    markActions.markName(obj);
                    break;
                case 'Node':
                    self.notify('markNode', obj);
                    markActions.markNode(obj);
                    break;
                default:
                    throw new U.DevelopError('why you can choose an unknown type object');
            }
        }
    });
    
    return new ObjectMarker();
});