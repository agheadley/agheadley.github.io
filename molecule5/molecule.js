var Molecule = (function () {
    function Molecule(main, info, image, w, h, posx, posy, velx, vely) {
        var _this = this;
        this.getState = function () {
            // returns object {x:,y:,vx:,vy:,angle:,omega:} // angle is current rotation, omega is angular velocity. 
            var pos = _this.physics.state.pos.values();
            var vel = _this.physics.state.vel.values();
            var state = { w: _this.w, h: _this.h, x: pos.x, y: pos.y, vx: vel.x, vy: vel.y, angle: _this.physics.state.angular.pos, omega: _this.physics.state.angular.vel };
            return state;
        };
        this.massCorrection = 0.01; /* don't allow RAM in kg (assumed) instead reduce masses for physics.js */
        this.name = info.name;
        this.shape = info.shape;
        this.mass = info.mass * this.massCorrection;
        this.w = w;
        this.h = h;
        this.img = image;
        var vertexList = [];
        if (this.shape == 'rectangle')
            vertexList = [{ x: -this.w / 2, y: -this.h / 2 }, { x: this.w / 2, y: -this.h / 2 }, { x: this.w / 2, y: this.h / 2 }, { x: -this.w / 2, y: this.h / 2 }];
        else if (info.shape == 'triangle')
            vertexList = [{ x: 0, y: -this.h / 2 }, { x: this.w / 2, y: this.h / 2 }, { x: -this.w / 2, y: this.h / 2 }];
        var options = { vertices: vertexList, x: posx, y: posy, vx: velx, vy: vely, mass: this.mass, cof: 0, restitution: 1.0 };
        this.physics = main.addPolygon(options);
        //console.log('add molecule '+this.name);
        //console.log(this.physics);
    }
    return Molecule;
}());
//# sourceMappingURL=molecule.js.map