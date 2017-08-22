//load images and then go to Main class
var Main = (function () {
    function Main() {
        var _this = this;
        this.init = function () {
            _this.canvas = new Canvas('canvas');
            // set up basic physics
            _this.initWorld();
            // start step and collision listener
            _this.startSimulation();
            _this.reaction = new Reaction(_this.image.data, MOLECULE_INFO, REACTION_RULES, REACTION_INITIAL_STATE, SCALE, SPEED, _this.canvas, _this);
        };
        this.reset = function () {
            ///stop ticker
            Physics.util.ticker.off(function (time, dt) {
                MAIN.world.step(time);
            });
            _this.init();
        };
        this.step = function () {
            _this.canvas.clear();
            for (var i = 0; i < _this.reaction.molecule.length; i++) {
                var state = _this.reaction.molecule[i].getState();
                _this.canvas.drawImage(_this.reaction.molecule[i].img, state.x, state.y, state.w, state.h, state.angle);
            }
        };
        this.collision = function (data) {
            for (var i = 0; i < data.collisions.length; i++) {
                var indexA = void 0, indexB = void 0;
                var a = void 0, b = void 0;
                indexA = null;
                indexB = null;
                for (a = 0; a < _this.reaction.molecule.length; a++)
                    if (data.collisions[i].bodyA == _this.reaction.molecule[a].physics)
                        indexA = a;
                for (b = 0; b < _this.reaction.molecule.length; b++)
                    if (data.collisions[i].bodyB == _this.reaction.molecule[b].physics)
                        indexB = b;
                if (indexA != null && indexB != null) {
                    //console.log('collision ...  '+indexA+':'+this.reaction.molecule[indexA].name+'   '+indexB+':'+this.reaction.molecule[indexB].name);
                    _this.reaction.processCollision(indexA, indexB);
                }
            }
        };
        this.addPolygon = function (options) {
            var physics = Physics.body('convex-polygon', options);
            _this.world.add(physics);
            return physics;
        };
        this.startSimulation = function () {
            // start the ticker
            Physics.util.ticker.start();
            // set th
            _this.world.on('step', _this.step);
            // If you want to subscribe to collision pairs
            // emit an event for each collision pair
            _this.world.on('collisions:detected', _this.collision);
        };
        this.initWorld = function () {
            console.log('now initiatiating world physics ...');
            _this.world = Physics({ timestep: 1000.0 / 160, maxIPF: 16, integrator: 'verlet' });
            var gravity = Physics.behavior('constant-acceleration', { x: 0, y: 0.004 }); //default
            gravity.setAcceleration({ x: 0, y: 0 });
            _this.world.add(gravity);
            console.log(_this.world);
            var viewPort = Physics.behavior('edge-collision-detection', {
                aabb: Physics.aabb(0, 0, _this.canvas.width, _this.canvas.height),
                restitution: 1.0,
                cof: 1.0
            });
            _this.world.add(viewPort);
            _this.world.add(Physics.behavior('body-impulse-response'));
            // add body collision detection and resolution
            _this.world.add(Physics.behavior('body-collision-detection'));
            _this.world.add(Physics.behavior('sweep-prune'));
            // subscribe to ticker to advance the simulation
            Physics.util.ticker.on(function (time, dt) {
                MAIN.world.step(time);
            });
        };
        var imageFiles = [];
        for (var _i = 0, MOLECULE_INFO_1 = MOLECULE_INFO; _i < MOLECULE_INFO_1.length; _i++) {
            var item = MOLECULE_INFO_1[_i];
            imageFiles.push(item.file);
        }
        // load images and pass call back function to instantiate Main class when all have loaded
        this.image = new ImageLoad(imageFiles, function () {
            MAIN.init();
        });
    }
    return Main;
}());
//# sourceMappingURL=main.js.map