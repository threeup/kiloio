var eventPrefix = BABYLON.Tools.GetPointerPrefix();
var KCamera = (function (_super) {
    __extends(KCamera, _super);
    function KCamera(name, alpha, beta, radius, target, scene) {
        this.height = 100;
        this.lastPosition = BABYLON.Vector3.Zero();
        this.offsetX = 20;
        _super.call(this, name, alpha, beta, radius, target, scene);
         
    }

    KCamera.prototype.setPosition = function (position) {
        this.lastPosition = position;
        _super.prototype.setPosition.call(this, position);
    };

    KCamera.prototype.setSoftTarget = function (softTarget) {
        this.softTarget = softTarget;
    };

    KCamera.prototype.softFollow = function () {
        
        var diff = this.softTarget.position.subtract(this.target);
        diff.y = 0;
        var diffLength = diff.length(); 
        if( diffLength > 0.1 )
        {
            diff.normalize();
            var speed = Math.min(diffLength, 3);
            var velocity = diff.scale(speed);
            var nextTarget = this.target.add(velocity);
            var nextPos = this.lastPosition.add(velocity);
            
            this.target = nextTarget; 
            this.setPosition(nextPos);
        }
    };

    KCamera.prototype._checkInputs = function () {
        _super.prototype._checkInputs.call(this);
        this.softFollow();
    };
    KCamera.prototype.attachControl = function (element, noPreventDefault) {
        var _this = this;
        var cacheSoloPointer; // cache pointer object for better perf on camera rotation
        var previousPinchDistance = 0;
        var pointers = new BABYLON.SmartCollection();
        if (this._attachedElement) {
            return;
        }
        this._attachedElement = element;
        var engine = this.getEngine();

        if (this._onPointerDown === undefined) {
            
            this._onPointerMove = function (evt) {
                if (!noPreventDefault) {
                    evt.preventDefault();
                }
                switch (pointers.count) {
                    case 1:
                        var offsetX = evt.clientX - cacheSoloPointer.x;
                        var offsetY = evt.clientY - cacheSoloPointer.y;
                        _this.inertialAlphaOffset -= offsetX / _this.angularSensibility;
                        _this.inertialBetaOffset -= offsetY / _this.angularSensibility;
                        cacheSoloPointer.x = evt.clientX;
                        cacheSoloPointer.y = evt.clientY;
                        break;
                    case 2:
                        //if (noPreventDefault) { evt.preventDefault(); } //if pinch gesture, could be usefull to force preventDefault to avoid html page scroll/zoom in some mobile browsers
                        pointers.item(evt.pointerId).x = evt.clientX;
                        pointers.item(evt.pointerId).y = evt.clientY;
                        var direction = _this.pinchInwards ? 1 : -1;
                        var distX = pointers.getItemByIndex(0).x - pointers.getItemByIndex(1).x;
                        var distY = pointers.getItemByIndex(0).y - pointers.getItemByIndex(1).y;
                        var pinchSquaredDistance = (distX * distX) + (distY * distY);
                        if (previousPinchDistance === 0) {
                            previousPinchDistance = pinchSquaredDistance;
                            return;
                        }
                        if (pinchSquaredDistance !== previousPinchDistance) {
                            _this.inertialRadiusOffset += (pinchSquaredDistance - previousPinchDistance) / (_this.pinchPrecision * _this.wheelPrecision * _this.angularSensibility * direction);
                            previousPinchDistance = pinchSquaredDistance;
                        }
                        break;
                    default:
                        if (pointers.item(evt.pointerId)) {
                            pointers.item(evt.pointerId).x = evt.clientX;
                            pointers.item(evt.pointerId).y = evt.clientY;
                        }
                }
            };
            this._onMouseMove = function (evt) {
                if (!engine.isPointerLock) {
                    return;
                }
                var offsetX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || evt.msMovementX || 0;
                var offsetY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || evt.msMovementY || 0;
                _this.inertialAlphaOffset -= offsetX / _this.angularSensibility;
                _this.inertialBetaOffset -= offsetY / _this.angularSensibility;
                if (!noPreventDefault) {
                    evt.preventDefault();
                }
            };
            this._wheel = function (event) {
                var delta = 0;
                if (event.wheelDelta) {
                    delta = event.wheelDelta / (_this.wheelPrecision * 40);
                }
                else if (event.detail) {
                    delta = -event.detail / _this.wheelPrecision;
                }
                if (delta)
                {
                    _this.inertialRadiusOffset += delta;
                    _this.lastPosition = _this.position;
                }
                if (event.preventDefault) {
                    if (!noPreventDefault) {
                        event.preventDefault();
                    }
                }
            };
            
            this._onLostFocus = function () {
                _this._keys = [];
                pointers.empty();
                previousPinchDistance = 0;
                cacheSoloPointer = null;
            };
            this._onGestureStart = function (e) {
                if (window.MSGesture === undefined) {
                    return;
                }
                if (!_this._MSGestureHandler) {
                    _this._MSGestureHandler = new MSGesture();
                    _this._MSGestureHandler.target = element;
                }
                _this._MSGestureHandler.addPointer(e.pointerId);
            };
            this._onGesture = function (e) {
                _this.radius *= e.scale;
                if (e.preventDefault) {
                    if (!noPreventDefault) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                }
            };
            this._reset = function () {
                _this._keys = [];
                _this.inertialAlphaOffset = 0;
                _this.inertialBetaOffset = 0;
                _this.inertialRadiusOffset = 0;
                pointers.empty();
                previousPinchDistance = 0;
                cacheSoloPointer = null;
            };
        }
        element.addEventListener(eventPrefix + "down", this._onPointerDown, false);
        element.addEventListener(eventPrefix + "up", this._onPointerUp, false);
        element.addEventListener(eventPrefix + "out", this._onPointerUp, false);
        element.addEventListener(eventPrefix + "move", this._onPointerMove, false);
        element.addEventListener("mousemove", this._onMouseMove, false);
        element.addEventListener("MSPointerDown", this._onGestureStart, false);
        element.addEventListener("MSGestureChange", this._onGesture, false);
        element.addEventListener('mousewheel', this._wheel, false);
        element.addEventListener('DOMMouseScroll', this._wheel, false);
        BABYLON.Tools.RegisterTopRootEvents([
            { name: "keydown", handler: this._onKeyDown },
            { name: "keyup", handler: this._onKeyUp },
            { name: "blur", handler: this._onLostFocus }
        ]);
    }
    
    return KCamera;
})(BABYLON.ArcRotateCamera);

BABYLON.KCamera = KCamera;