import * as React from "react";

import {IBasePlugin} from "takcast.interface";
import {ISource} from "takcast.interface";
import {ISourceInfo} from "takcast.interface";
import {IMediaPlugin} from "takcast.interface";

/**
 * カメラ・マイクキャプチャ用のソースをコントロールする
 */
export class Source implements ISource {
  // 名前はcapture一択
  public name = "capture";
  // カメラとマイク両方扱うのでvideo / audio
  public type = ["video", "audio"];
  // 処理に利用するvideoタグ
  private video:HTMLVideoElement;
  // 音量をコントロールするために
  // mediaSourceNode -> gainNode -> outputと処理する
  private node:AudioNode;
  private gainNode:GainNode;
  // getUserMediaで取得したstream情報
  // あとで停止したときにtrackの停止を実施するのに必要なので、保持
  private stream:MediaStream;
  // 情報
  private info:{};
  constructor(basePlugin:IBasePlugin) {
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
    setTimeout(() => {
      if(this.video) { // 何らかの原因でvideoタグができなかったら処理しない
        navigator.mediaDevices.getUserMedia({
          video:true,
          audio:true
        }).then((stream:MediaStream) => {
          // streamを保存。あとで入らなくなったら全trackに対してstopかける
          this.stream = stream;
          // 音声ノードの準備
          this.node = basePlugin.refAudioContext().createMediaStreamSource(stream);
          this.node.connect(this.gainNode);

          // videoタグから音声のtrackを切り離しておく
          stream.getAudioTracks().forEach((track) => {
            stream.removeTrack(track);
          });
          this.video.srcObject = stream;
          this.video.play(); // 映像表示開始
        });
      }
    }, 200);
  }
  public refAudioNode():AudioNode {
    return this.gainNode;
  }
  public refVideoImage():HTMLVideoElement {
    return this.video;
  }
  public release():void {
    Object.keys(this.info).forEach((key) => {
      var info = this.info[key] as ISourceInfo;
      info.plugin.onRemoveSource(this);
    });
    // setTimeoutによる構築前にここにきてしまった場合やばいかも
    if(this.stream) {
      this.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    this.node.disconnect();
    this.gainNode.disconnect();
    this.video.pause();
    this.video = null;
  }
  public refInfo(mediaPlugin:IMediaPlugin):ISourceInfo {
    if(typeof(this.info[mediaPlugin.name]) == "undefined") {
      this.info[mediaPlugin.name] = {
        plugin:mediaPlugin,
        data:{}
      };
    }
    return this.info[mediaPlugin.name] as ISourceInfo;
  }
/*  public _refGainNode():GainNode {
    return this.gainNode;
  }*/
  public setVolume(value:number):void {
    this.gainNode.gain.value = value / 100;
  }
  public getVolume():number {
    return this.gainNode.gain.value * 100;
  }
  public refDisplayElement():HTMLVideoElement {
    return this.video;
  }
}
