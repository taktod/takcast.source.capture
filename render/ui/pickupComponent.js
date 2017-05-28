"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactBootstrap = require("react-bootstrap");
var Form = ReactBootstrap.Form;
var FormGroup = ReactBootstrap.FormGroup;
exports.pickupComponent = function (capture) {
    return (function (_super) {
        __extends(PickupComponent, _super);
        function PickupComponent() {
            var _this = _super.call(this) || this;
            _this.width = 320;
            _this.height = 240;
            return _this;
        }
        PickupComponent.prototype.componentWillUnmount = function () {
            this.stream.getTracks().forEach(function (track) {
                track.stop();
            });
        };
        PickupComponent.prototype.componentDidMount = function () {
            var _this = this;
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            }).then(function (stream) {
                var video = _this.refs["view"];
                video.srcObject = stream;
                video.volume = 0; // 音はとりあえずださないようにしておく
                video.play();
                _this.stream = stream;
            });
        };
        PickupComponent.prototype.render = function () {
            return (React.createElement(Form, null,
                React.createElement(FormGroup, null,
                    React.createElement("video", { ref: "view", style: { width: this.width + "px", height: this.height + "px" } }))));
        };
        return PickupComponent;
    }(React.Component));
};
