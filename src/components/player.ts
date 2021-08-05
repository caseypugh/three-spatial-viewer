import {
  Object3D,
  ShaderMaterial,
  Mesh,
  PlaneBufferGeometry,
  Texture,
  RGBFormat,
  FrontSide,
  RepeatWrapping
} from './three'

// @ts-ignore
import frag from '../shaders/spatial.frag'
// @ts-ignore
import vert from '../shaders/spatial.vert'

import { Uniforms } from './uniforms'
import { Props, QuiltConfig, SpatialType, StereoMode } from './constants'

export default class Player extends Object3D {

  private props: Props = new Props()

  private static geometry: PlaneBufferGeometry

  private material: ShaderMaterial = new ShaderMaterial({
    uniforms: Uniforms,
    vertexShader: vert,
    fragmentShader: frag,
    transparent: true,
    side: FrontSide,
  })

  constructor(texture: Texture, depth?: Texture, props?: Props) {
    super()

    /** Assign the user provided props, if any */
    this.setProps(this.props, props)

    /** Add the compiler definitions needed to pick the right GLSL methods */
    this.setShaderDefines(this.shaderDefines)

    /**
     * Create the geometry only once, it can be shared between instances
     *  of the viewer since it's kept as a static class member
     **/
    if (!Player.geometry) {
      Player.geometry = new PlaneBufferGeometry(1, 1)
      // Player.geometry.scale(this.aspectRatio, 1, 1);
      this.scale.x = this.aspectRatio
    }

    /** Assign the textures and update the shader uniforms */
    this.assignTexture(texture)
    this.updateUniforms()

    /** Create the Mesh/Points and add it to the viewer object */
    super.add(this.createMesh(Player.geometry, this.material))
  }

  private createMesh(geo: PlaneBufferGeometry, mat: ShaderMaterial) {
    return new Mesh(geo, mat);
  }

  /** Internal util to assign the textures to the shader uniforms */
  private assignTexture(tex: Texture): void {
    this.texture = this.setDefaultTextureProps(tex)
  }

  private clearDefines(defines: Array<string>): void {
    defines.forEach(define => {
      delete this.material.defines[define]
    })
    this.material.needsUpdate = true
  }

  private setShaderDefines(defines: Array<string>): void {
    defines.forEach(define => {
      if (define) {
        this.material.defines[define] = ''
      }
    })
    this.material.needsUpdate = true
  }

  /** Internal util to set viewer props from config object */
  private setProps(viewerProps: Props, userProps?: object): void {
    if (!userProps) return

    /** Iterate over user provided props and assign to viewer props */
    for (let prop in userProps) {
      if (prop in viewerProps) {
        viewerProps[prop] = userProps[prop]
      } else {
        console.warn(
          `SpatialViewer: Provided ${prop} in config but it is not a valid property and wiill be ignored`,
        )
      }
    }
  }

  private setDefaultTextureProps(texture: Texture): Texture {
    texture.format = RGBFormat
    texture.generateMipmaps = true
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    return texture
  }

  private updateUniforms() {
    this.material.uniforms.quiltStereoEyeDistance.value = this.props.quilt.stereoEyeDistance
    this.material.uniforms.quiltAngle.value = this.props.quilt.angle
    this.material.uniforms.quiltColumns.value = this.props.quilt.columns
    this.material.uniforms.quiltRows.value = this.props.quilt.rows
  }

  public get shaderDefines(): Array<string> {
    return [SpatialType[this.props.spatialType], 
            "STEREO_" + StereoMode[this.props.stereoMode],
            this.props.stereoMode == StereoMode.OFF ? null : "STEREO_ON" ]
  }

  public get spatial(): SpatialType {
    return this.props.spatialType
  }

  public set spatial(val: SpatialType) {
    this.clearDefines(this.shaderDefines)
    this.props.spatialType = val
    this.setShaderDefines(this.shaderDefines)
  }

  public get stereoMode(): StereoMode {
    return this.props.stereoMode
  }

  public set stereoMode(val: StereoMode) {
    this.clearDefines(this.shaderDefines)
    this.props.stereoMode = val
    this.setShaderDefines(this.shaderDefines)
    this.scale.set(this.aspectRatio, 1, 1)
  }

  public get aspectRatio(): number {
    if (this.props.stereoMode == StereoMode.LEFT_RIGHT) {
      return (this.props.quilt.width * 2.0) / this.props.quilt.height
    }
    
    return this.props.quilt.width / this.props.quilt.height
  }

  public get quiltAngle(): number {
    return this.props.quilt.angle
  }

  public set quiltAngle(val: number) {
    this.props.quilt.angle = val
    this.updateUniforms()
  }

  public get quiltStereoEyeDistance(): number {
    return this.props.quilt.stereoEyeDistance
  }

  public set quiltStereoEyeDistance(val: number) {
    this.props.quilt.stereoEyeDistance = val
    this.updateUniforms()
  }

  public get quiltWidth(): number {
    return this.props.quilt.width
  }

  public set quiltWidth(val: number) {
    this.props.quilt.width = val
    this.updateUniforms()
  }

  public set quiltHeight(val: number) {
    this.props.quilt.height = val
    this.updateUniforms()
  }

  public get quiltHeight(): number {
    return this.props.quilt.height
  }

  public set quiltRows(val: number) {
    this.props.quilt.rows = val
    this.updateUniforms()
  }

  public get quiltRows(): number {
    return this.props.quilt.rows
  }

  public set quiltColumns(val: number) {
    this.props.quilt.columns = val
    this.updateUniforms()
  }

  public get quiltColumns(): number {
    return this.props.quilt.columns
  }

  public set texture(map: Texture) {
    this.material.uniforms.colorTexture.value = map
  }

  public get texture(): Texture {
    return this.material.uniforms.colorTexture.value
  }

}
