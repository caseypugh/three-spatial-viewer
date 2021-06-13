enum SpatialType {
  MONO = 0,
  STEREO = 1,
  LOOKING_GLASS = 2
}

enum StereoMode {
  COLOR = 0,
  RED_CYAN = 1,
  DIFFERENCE = 2,
  LEFT_RIGHT = 3,
  OFF,
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
  public spatialType: SpatialType = SpatialType.MONO
  public quilt: QuiltConfig = null
  public stereoMode: StereoMode = StereoMode.COLOR
}

export { QuiltConfig, SpatialType, StereoMode, Props }