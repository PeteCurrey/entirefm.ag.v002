declare module '@mkkellogg/gaussian-splats-3d' {
  export class Viewer {
    constructor(options?: Record<string, any>);
    addSplatScene(path: string, options?: Record<string, any>): Promise<void>;
    start(): void;
    stop(): void;
    dispose(): void;
    controls: any;
    camera: any;
    [key: string]: any;
  }

  export class DropInViewer {
    constructor(options?: Record<string, any>);
    addSplatScenes(scenes: any[], options?: Record<string, any>): Promise<void>;
    addSplatScene(path: string, options?: Record<string, any>): Promise<void>;
    [key: string]: any;
  }

  export class PlyParser {
    static parseToUncompressedSplatArray(buffer: ArrayBuffer): any;
    static parseToUncompressedSplatBuffer(buffer: ArrayBuffer): any;
  }

  export class PlyLoader {
    static loadFromURL(path: string, onProgress?: Function, streamLoadData?: boolean, minimumAlpha?: number, compressionLevel?: number, outSphericalHarmonicsDegree?: number): Promise<any>;
    static loadFromFileData(fileData: Uint8Array, onProgress?: Function, streamLoadData?: boolean, minimumAlpha?: number, compressionLevel?: number, outSphericalHarmonicsDegree?: number): Promise<any>;
  }

  export class KSplatLoader {
    static loadFromURL(path: string, onProgress?: Function, streamLoadData?: boolean, minimumAlpha?: number, compressionLevel?: number, outSphericalHarmonicsDegree?: number): Promise<any>;
    static loadFromFileData(fileData: Uint8Array): Promise<any>;
    static downloadFile(path: string, onProgress?: Function): Promise<any>;
    static checkVersion(buffer: ArrayBuffer): void;
  }

  export class SplatLoader {
    static loadFromURL(path: string, onProgress?: Function, streamLoadData?: boolean, minimumAlpha?: number, compressionLevel?: number, outSphericalHarmonicsDegree?: number): Promise<any>;
    static loadFromFileData(fileData: Uint8Array): Promise<any>;
  }

  export class SplatBuffer {
    constructor(bufferData: ArrayBuffer, needPrecomputedCovariancesForRendering?: boolean);
    getSplatCount(): number;
    getMaxSplatCount(): number;
    getSplatCenter(index: number, outCenter: any, transform?: any): void;
    getSplatColor(index: number, outColor: any): void;
    bufferData: ArrayBuffer;
    [key: string]: any;
    static generateFromUncompressedSplatArrays(splatArrays: any[], minimumAlpha?: number, compressionLevel?: number, sceneCenter?: any, blockSize?: number, bucketSize?: number, options?: any): SplatBuffer;
    static BucketBlockSize: number;
    static BucketSize: number;
  }

  export class SplatBufferGenerator {
    constructor(splatPartitioner: any, alphaRemovalThreshold: number, compressionLevel: number, sectionSize?: number, sceneCenter?: any, blockSize?: number, bucketSize?: number);
    generateFromUncompressedSplatArray(splatArray: any): SplatBuffer;
    static getStandardGenerator(alphaRemovalThreshold?: number, compressionLevel?: number, sectionSize?: number, sceneCenter?: any, blockSize?: number, bucketSize?: number): SplatBufferGenerator;
  }

  export class SplatPartitioner {
    static getStandardPartitioner(sectionSize?: number, sceneCenter?: any, blockSize?: number, bucketSize?: number): SplatPartitioner;
    partitionUncompressedSplatArray(splatArray: any): { splatArrays: any[]; parameters: any };
  }

  export class SplatParser {
    [key: string]: any;
  }

  export class OrbitControls {
    [key: string]: any;
  }

  export class PlayCanvasCompressedPlyParser {
    [key: string]: any;
  }

  export class SpzLoader {
    [key: string]: any;
  }

  export class AbortablePromise extends Promise<any> {
    abort(): void;
  }

  export class LoaderUtils {
    static sceneFormatFromPath(path: string): number;
  }

  export enum SceneFormat {
    Splat = 0,
    KSplat = 1,
    Ply = 2,
  }

  export enum RenderMode {
    Always = 0,
    OnChange = 1,
    Never = 2,
  }

  export enum SceneRevealMode {
    Default = 0,
    Gradual = 1,
    Instant = 2,
  }

  export enum SplatRenderMode {
    ThreeD = 0,
    TwoD = 1,
  }

  export enum WebXRMode {
    None = 0,
    VR = 1,
    AR = 2,
  }

  export enum LogLevel {
    None = 0,
    Error = 1,
    Warning = 2,
    Info = 3,
    Debug = 4,
  }
}
