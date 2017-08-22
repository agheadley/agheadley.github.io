var Canvas = (function () {
    function Canvas(id) {
        var _this = this;
        this.clear = function () {
            _this.ctx.clearRect(0, 0, _this.width, _this.height);
        };
        this.drawImage = function (img, x, y, w, h, angle) {
            _this.ctx.save();
            //ctx.translate(pos.x,pos.y);
            _this.ctx.translate(x, y);
            _this.ctx.rotate(angle);
            _this.ctx.drawImage(img, -w / 2, -h / 2, w, h);
            _this.ctx.restore();
        };
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }
    return Canvas;
}());
//# sourceMappingURL=canvas.js.map