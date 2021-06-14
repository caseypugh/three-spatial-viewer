declare enum SpatialType {
    LOOKING_GLASS = 0
}
declare enum StereoMode {
    OFF = 0,
    COLOR = 1,
    RED_CYAN = 2,
    DIFFERENCE = 3,
    LEFT_RIGHT = 4
}
declare class QuiltConfig {
    angle: number;
    stereoEyeDistance: number;
    rows: number;
    columns: number;
    width: number;
    height: number;
}
declare class Props {
    spatialType: SpatialType;
    quilt: QuiltConfig;
    stereoMode: StereoMode;
}
export { QuiltConfig, SpatialType, StereoMode, Props };
