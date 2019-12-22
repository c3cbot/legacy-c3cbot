import * as tf from '@tensorflow/tfjs';
import * as SuperGif from 'libgif';
interface frameResult {
    index: number;
    totalFrames: number;
    predictions: Array<Object>;
}
interface classifyConfig {
    topk?: number;
    onFrame?: (result: frameResult) => {};
    setGifControl?: (gifControl: typeof SuperGif) => {};
}
interface nsfwjsOptions {
    size: number;
}
export declare function load(base?: string, options?: {
    size: number;
}): Promise<NSFWJS>;
interface IOHandler {
    load: () => any;
}
export declare class NSFWJS {
    endpoints: string[];
    private options;
    private pathOrIOHandler;
    private model;
    private intermediateModels;
    private normalizationOffset;
    constructor(modelPathBaseOrIOHandler: string | IOHandler, options: nsfwjsOptions);
    load(): Promise<void>;
    infer(img: tf.Tensor3D | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, endpoint?: string): tf.Tensor;
    classify(img: tf.Tensor3D | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, topk?: number): Promise<Array<{
        className: string;
        probability: number;
    }>>;
    classifyGif(gif: HTMLImageElement, config?: classifyConfig): Promise<Array<Array<{
        className: string;
        probability: number;
    }>>>;
}
export {};
