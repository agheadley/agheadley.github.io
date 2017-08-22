// new images loaded with array of file names (assumed to be in directory ./images/)
// this.img contains an array of loaded image objects
// adapted from https://stackoverflow.com/questions/18974517/check-if-images-are-loaded-before-gameloop
var ImageLoad = (function () {
    function ImageLoad(images, doneFunction) {
        var _this = this;
        console.log('ImageLoad class...');
        this.data = [];
        var count = 0;
        var _loop_1 = function (i) {
            this_1.data[i] = new Image();
            /// set handler and url
            this_1.data[i].src = 'images/' + images[i];
            this_1.data[i].onload = function () {
                count += 1;
                console.log(count + ': ' + _this.data[i]);
                if (count == images.length)
                    doneFunction();
            };
        };
        var this_1 = this;
        for (var i = 0; i < images.length; i++) {
            _loop_1(i);
        }
    }
    return ImageLoad;
}());
//# sourceMappingURL=imageLoad.js.map