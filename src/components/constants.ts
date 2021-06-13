enum SpatialType {
  // MONO = 0,
  // STEREO = 1,
  LOOKING_GLASS
}

enum StereoMode {
  OFF,
  COLOR ,
  RED_CYAN,
  DIFFERENCE,
  LEFT_RIGHT,
}

class QuiltConfig {
  public angle: number = 0
  public stereoEyeDistance: number = 8
  public rows: number = 8
  public columns: number = 8
  public width: number = 480
  public height: number = 640
}

class Props {
  public spatialType: SpatialType = SpatialType.LOOKING_GLASS
  public quilt: QuiltConfig = null
  public stereoMode: StereoMode = StereoMode.COLOR
}

export { QuiltConfig, SpatialType, StereoMode, Props }