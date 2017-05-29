import * as React from "react";

import {IBasePlugin} from "takcast.interface";
import {ISourcePlugin} from "takcast.interface";
import {ISource} from "takcast.interface";
import {IPlugin} from "takcast.interface";

import {pickupComponent} from "./ui/pickupComponent";
import {Source} from "./source";

/**
 * render側のplugin実態
 */
export class Capture implements ISourcePlugin {
  public name = "capture";
  public type = "source";
  private basePlugin:IBasePlugin;
  public setPlugins(plugins:{[key:string]:Array<IPlugin>}):void {
    this.basePlugin = plugins["base"][0] as IBasePlugin;
  }
  public refPickupComponent():React.ComponentClass<{}> {
    return pickupComponent(this);
  }
  public createNewSource():ISource {
    return new Source(this.basePlugin);
  }
}

export var _ = new Capture();
