import * as React from "react";

import {IBasePlugin} from "takcast.interface";
import {ISource} from "takcast.interface";
import {ISourceInfo} from "takcast.interface";
import {IMediaPlugin} from "takcast.interface";

export class Source implements ISource {
  public name = "capture";
  public type = ["video", "audio"];
  private video:HTMLVideoElement;
  private node:AudioNode;
  private gainNode:GainNode;
  private stream:MediaStream;
  private info:{};
  constructor(basePlugin:IBasePlugin) {
    this.info = {};
    this.video = document.createElement("video");
    this.video.style["width"] = "100%";
    this.video.controls = true;
    this.gainNode = basePlugin.refAudioContext().createGain();
    this.gainNode.gain.value = 1.0;
    this.gainNode.connect(basePlugin.refDevnullNode());
    this.stream = null;
    setTimeout(() => {
      if(this.video) {
        navigator.mediaDevices.getUserMedia({
          video:true,
          audio:true
        }).then((stream:MediaStream) => {
          this.stream = stream;
          this.node = basePlugin.refAudioContext().createMediaStreamSource(stream);
          this.node.connect(this.gainNode);

          stream.getAudioTracks().forEach((track) => {
            stream.removeTrack(track);
          });
          this.video.srcObject = stream;
          this.video.play();
        });
      }
    }, 200);
  }
/*  public refPaletteComponent():React.ComponentClass<{className:string,onClick:any,href:string,active:boolean,name:string}> {
    return paletteComponent(this);
  }*/
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
  public _refGainNode():GainNode {
    return this.gainNode;
  }
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
