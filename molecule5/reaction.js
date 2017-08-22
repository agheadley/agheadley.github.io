/* 4 key arrays passed to constructor - image and moleculeInfo must be in matching order */
var Reaction = (function () {
    function Reaction(imageData, molData, ruleData, initialStateData, scale, speed, canvas, main) {
        var _this = this;
        this.processCollision = function (indexA, indexB) {
            /* check energy of collision (really just look at total speed) */
            var state = _this.molecule[indexA].getState();
            var energy = Math.sqrt(state.vx * state.vx + state.vy * state.vy);
            state = _this.molecule[indexB].getState();
            energy += Math.sqrt(state.vx * state.vx + state.vy * state.vy);
            energy = energy / 2; /* get average speed */
            var removeList = [];
            var addList = [];
            for (var _i = 0, _a = _this.rule; _i < _a.length; _i++) {
                var item = _a[_i];
                if ((item.molA == _this.molecule[indexA].name && item.molB == _this.molecule[indexB].name) || (item.molA == _this.molecule[indexB].name && item.molB == _this.molecule[indexA].name)) {
                    if (energy > (item.energy * _this.speed / 100)) {
                        console.log('removing ' + item.molA + ' & ' + item.molB + ' adding ' + item.result);
                        removeList.push(indexA);
                        removeList.push(indexB);
                        for (var i = 0; i < item.result.length; i++)
                            addList.push(item.result[i]);
                    }
                }
            }
            console.log('remove : ' + removeList);
            console.log('add : ' + addList);
            // descend sort removals to allow splice to work correctly
            removeList.sort(function (a, b) { return b - a; });
            for (var i = 0; i < removeList.length; i++) {
                _this.main.world.removeBody(_this.molecule[removeList[i]].physics);
                _this.molecule.splice(removeList[i], 1);
            }
            for (var i = 0; i < addList.length; i++) {
                var ox = 0;
                var oy = 0;
                _this.molecule.push(_this.addMolecule(addList[i], ox, oy));
            }
            _this.getTotals();
        };
        this.setInitialState = function () {
            //this.molecule[0]=this.addMolecule('NO');
            var count = 0;
            //console.log('Adding molecules...( reaction.setInititalState() )');
            //console.log(this.initialState);
            for (var i = 0; i < _this.initialState.length; i++) {
                console.log('adding ' + _this.initialState[i]["name"] + ' total ' + _this.initialState[i]["total"] + ' ...');
                for (var j = 0; j < _this.initialState[i]["total"]; j++) {
                    console.log(_this.molecule);
                    _this.molecule.push(_this.addMolecule(_this.initialState[i]["name"], _this.width / 2, _this.height / 2));
                    count++;
                }
            }
            //console.log(this.molecule);
        };
        this.getTotals = function () {
            var count = {};
            for (var _i = 0, _a = _this.initialState; _i < _a.length; _i++) {
                var item = _a[_i];
                count[item.name] = 0;
            }
            for (var i = 0; i < _this.molecule.length; i++) {
                count[_this.molecule[i].name] += 1;
            }
            console.log(count);
        };
        this.addMolecule = function (name, ox, oy) {
            var img = _this.molInfo[name].img;
            var w = img.width * _this.scale;
            var h = img.height * _this.scale;
            var x = getRandom(w, _this.width - w);
            var y = getRandom(h, _this.height - h);
            var vx = getRandom(-_this.speed / 2, _this.speed / 2);
            var vy = Math.sqrt(_this.speed * _this.speed - vx * vx);
            if (Math.random() < 0.5)
                vy = -vy;
            var molecule = new Molecule(_this.main, _this.molInfo[name], img, w, h, x, y, vx, vy);
            return molecule;
        };
        this.molecule = [];
        this.scale = scale;
        this.speed = speed;
        this.width = canvas.width;
        this.height = canvas.height;
        this.main = main;
        this.canvas = canvas;
        this.rule = ruleData;
        this.initialState = initialStateData;
        this.molInfo = {};
        /* create associative array of info with img data */
        for (var i = 0; i < molData.length; i++) {
            this.molInfo[molData[i].name] = { name: molData[i].name, img: imageData[i], shape: molData[i].shape, mass: molData[i].mass };
        }
        this.setInitialState();
    }
    return Reaction;
}());
//# sourceMappingURL=reaction.js.map