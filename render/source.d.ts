import { IBasePlugin } from "takcast.interface";
import { ISource } from "takcast.interface";
import { ISourceInfo } from "takcast.interface";
import { IMediaPlugin } from "takcast.interface";
/**
 * カメラ・マイクキャプチャ用のソースをコントロールする
 */
export declare class Source implements ISource {
    name: string;
    type: string[];
    private video;
    private node;
    private gainNode;
    private stream;
    private info;
    constructor(basePlugin: IBasePlugin);
    refAudioNode(): AudioNode;
    refVideoImage(): HTMLVideoElement;
    release(): void;
    refInfo(mediaPlugin: IMediaPlugin): ISourceInfo;
    setVolume(value: number): void;
    getVolume(): number;
    refDisplayElement(): HTMLVideoElement;
}
