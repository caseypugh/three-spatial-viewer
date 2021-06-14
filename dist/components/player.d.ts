import { Object3D, Texture } from './three';
import { SpatialType, StereoMode } from './constants';
export default class Player extends Object3D {
    private props;
    private static geometry;
    private material;
    constructor(texture: Texture, depth?: Texture, props?: object);
    private createMesh;
    /** Internal util to assign the textures to the shader uniforms */
    private assignTexture;
    private clearDefines;
    private setShaderDefines;
    /** Internal util to set viewer props from config object */
    private setProps;
    private setDefaultTextureProps;
    private updateUniforms;
    get shaderDefines(): Array<string>;
    get spatial(): SpatialType;
    set spatial(val: SpatialType);
    get stereoMode(): StereoMode;
    set stereoMode(val: StereoMode);
    get aspectRatio(): number;
    get quiltAngle(): number;
    set quiltAngle(val: number);
    get quiltStereoEyeDistance(): number;
    set quiltStereoEyeDistance(val: number);
    get quiltWidth(): number;
    set quiltWidth(val: number);
    set quiltHeight(val: number);
    get quiltHeight(): number;
    set quiltRows(val: number);
    get quiltRows(): number;
    set quiltColumns(val: number);
    get quiltColumns(): number;
    set texture(map: Texture);
    get texture(): Texture;
}
