"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pickupComponent_1 = require("./ui/pickupComponent");
var source_1 = require("./source");
var Capture = (function () {
    function Capture() {
        this.name = "capture";
        this.type = "source";
    }
    Capture.prototype.setPlugins = function (plugins) {
        this.basePlugin = plugins["base"][0];
    };
    Capture.prototype.refPickupComponent = function () {
        return pickupComponent_1.pickupComponent(this);
    };
    Capture.prototype.createNewSource = function () {
        return new source_1.Source(this.basePlugin);
    };
    return Capture;
}());
exports.Capture = Capture;
exports._ = new Capture();
