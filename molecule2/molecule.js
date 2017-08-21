var Molecule = (function () {
    function Molecule(info, image, posx, posy, velx, vely) {
        var _this = this;
        this.getState = function () {
            // returns object {x:,y:,vx:,vy:,angle:,omega:} // angle is current rotation, omega is angular velocity. 
            var pos = _this.physics.state.pos.values();
            var vel = _this.physics.state.vel.values();
            var state = { x: pos.x, y: pos.y, vx: vel.x, vy: vel.y, angle: _this.physics.state.angular.pos, omega: _this.physics.state.angular.vel };
            return state;
        };
        this.show = function () {
            var state = _this.getState();
            //let pos=this.physics.state.pos.values();
            //let angle=this.physics.state.angular.pos;
            ctx.save();
            //ctx.translate(pos.x,pos.y);
            ctx.translate(state.x, state.y);
            ctx.rotate(state.angle);
            ctx.drawImage(_this.img, -_this.w / 2, -_this.h / 2, _this.w, _this.h);
            ctx.restore();
        };
        console.log('Main class...');
        this.name = info["name"];
        this.img = image;
        this.w = image.width * scale;
        this.h = image.height * scale;
        var vertexList = [];
        if (info["shape"] == 'rectangle')
            vertexList = [{ x: -this.w / 2, y: -this.h / 2 }, { x: this.w / 2, y: -this.h / 2 }, { x: this.w / 2, y: this.h / 2 }, { x: -this.w / 2, y: this.h / 2 }];
        else if (info["shape"] == 'triangle')
            vertexList = [{ x: 0, y: -this.h / 2 }, { x: this.w / 2, y: this.h / 2 }, { x: -this.w / 2, y: this.h / 2 }];
        var options = { vertices: vertexList, x: posx, y: posy, vx: velx, vy: vely, cof: 0, restitution: 1.0 };
        console.log('creating molecule:' + this.name + ' shape:' + info["shape"] + ' options...');
        console.log(options);
        this.physics = Physics.body('convex-polygon', options);
        world.add(this.physics);
    }
    return Molecule;
}());
//# sourceMappingURL=molecule.js.map