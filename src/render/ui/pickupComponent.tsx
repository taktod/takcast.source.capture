import * as React from "react";
import * as ReactBootstrap from "react-bootstrap";

import {Capture} from "..";
var Form         = ReactBootstrap.Form;
var FormGroup    = ReactBootstrap.FormGroup;

export var pickupComponent = (capture:Capture):any => {
  return class PickupComponent extends React.Component<{}, {}> {
    private width=320;
    private height=240;
    private runAnimation:number;
    private stream:MediaStream;
    constructor() {
      super();
    }
    public componentWillUnmount() {
      this.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    public componentDidMount() {
      navigator.mediaDevices.getUserMedia({
        video:true,
        audio:true
      }).then((stream:MediaStream) => {
        var video = this.refs["view"] as HTMLVideoElement;
        video.srcObject = stream;
        video.volume = 0; // 音はとりあえずださないようにしておく
        video.play();
        this.stream = stream;
      });
    }
    public render() {
      return (
        <Form>
          <FormGroup>
            <video ref="view" style={{width: this.width + "px",height: this.height + "px"}}></video>
          </FormGroup>
        </Form>
      );
    }
  }
}
