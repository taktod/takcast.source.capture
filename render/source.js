"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * カメラ・マイクキャプチャ用のソースをコントロールする
 */
var Source = (function () {
    function Source(basePlugin) {
        var _this = this;
        // 名前はcapture一択
        this.name = "capture";
        // カメラとマイク両方扱うのでvideo / audio
        this.type = ["video", "audio"];
        this.info = {};
        this.video = document.createElement("video");
        // これいらないかな。
        //    this.video.style["width"] = "100%";
        this.video.controls = false; // これ・・・コントロール必要ないと思う
        this.gainNode = basePlugin.refAudioContext().createGain();
        this.gainNode.gain.value = 1.0;
        this.gainNode.connect(basePlugin.refDevnullNode());
        this.stream = null;
        // そのまま実施するとうまく動作できないので、timeout挟んで遅延処理してやる
        setTimeout(function () {
            if (_this.video) {
                navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                }).then(function (stream) {
                    // streamを保存。あとで入らなくなったら全trackに対してstopかける
                    _this.stream = stream;
                    // 音声ノードの準備
                    _this.node = basePlugin.refAudioContext().createMediaStreamSource(stream);
                    _this.node.connect(_this.gainNode);
                    // videoタグから音声のtrackを切り離しておく
                    stream.getAudioTracks().forEach(function (track) {
                        stream.removeTrack(track);
                    });
                    _this.video.srcObject = stream;
                    _this.video.play(); // 映像表示開始
                });
            }
        }, 200);
    }
    Source.prototype.refAudioNode = function () {
        return this.gainNode;
    };
    Source.prototype.refVideoImage = function () {
        return this.video;
    };
    Source.prototype.release = function () {
        var _this = this;
        Object.keys(this.info).forEach(function (key) {
            var info = _this.info[key];
            info.plugin.onRemoveSource(_this);
        });
        // setTimeoutによる構築前にここにきてしまった場合やばいかも
        if (this.stream) {
            this.stream.getTracks().forEach(function (track) {
                track.stop();
            });
        }
        this.node.disconnect();
        this.gainNode.disconnect();
        this.video.pause();
        this.video = null;
    };
    Source.prototype.refInfo = function (mediaPlugin) {
        if (typeof (this.info[mediaPlugin.name]) == "undefined") {
            this.info[mediaPlugin.name] = {
                plugin: mediaPlugin,
                data: {}
            };
        }
        return this.info[mediaPlugin.name];
    };
    /*  public _refGainNode():GainNode {
        return this.gainNode;
      }*/
    Source.prototype.setVolume = function (value) {
        this.gainNode.gain.value = value / 100;
    };
    Source.prototype.getVolume = function () {
        return this.gainNode.gain.value * 100;
    };
    Source.prototype.refDisplayElement = function () {
        return this.video;
    };
    return Source;
}());
exports.Source = Source;
