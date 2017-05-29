/// <reference types="react" />
import * as React from "react";
import { ISourcePlugin } from "takcast.interface";
import { ISource } from "takcast.interface";
import { IPlugin } from "takcast.interface";
/**
 * render側のplugin実態
 */
export declare class Capture implements ISourcePlugin {
    name: string;
    type: string;
    private basePlugin;
    setPlugins(plugins: {
        [key: string]: Array<IPlugin>;
    }): void;
    refPickupComponent(): React.ComponentClass<{}>;
    createNewSource(): ISource;
}
export declare var _: Capture;
