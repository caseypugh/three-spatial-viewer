define(['exports', 'three'], (function (exports, three) { 'use strict';

  var frag = "#define GLSLIFY 1\nuniform sampler2D colorTexture;uniform float quiltRows;uniform float quiltColumns;uniform float quiltAngle;uniform float quiltStereoEyeDistance;uniform float u_vOffset;uniform float u_hOffset;varying vec2 vUv;vec4 getQuiltViewingAngle(sampler2D tex,float angle,int stereo){float stereoMulti=stereo>0 ? 2.0 : 1.0;float stereoOffset=stereo==2&&vUv.x>=0.5 ?-0.5 : 0.0;return texture2D(tex,vec2((vUv.x+stereoOffset)*(1.0/quiltColumns)*stereoMulti+mod(angle,quiltColumns)/quiltColumns,vUv.y*(1.0/quiltRows)+floor(angle/quiltColumns)/quiltRows));}void main(){\n#if defined(LOOKING_GLASS) && defined(STEREO_OFF)\ngl_FragColor=getQuiltViewingAngle(colorTexture,quiltAngle,0);\n#elif defined(LOOKING_GLASS) && defined(STEREO_ON)\nfloat total=quiltRows*quiltColumns;float angle=quiltAngle;if(angle+quiltStereoEyeDistance>=total){angle=total-quiltStereoEyeDistance-1.0;}\n#ifdef STEREO_LEFT_RIGHT\nvec4 tex_l=getQuiltViewingAngle(colorTexture,angle,1);vec4 tex_r=getQuiltViewingAngle(colorTexture,angle+quiltStereoEyeDistance,2);\n#else\nvec4 tex_l=getQuiltViewingAngle(colorTexture,angle,0);vec4 tex_r=getQuiltViewingAngle(colorTexture,angle+quiltStereoEyeDistance,0);\n#endif\n#elif defined(STEREO)\nvec4 tex_l=texture2D(colorTexture,vec2(vUv.x*0.5,vUv.y));vec4 tex_r=texture2D(colorTexture,vec2(vUv.x*0.5+0.5+u_hOffset,vUv.y+u_vOffset));\n#endif\n#if defined(STEREO_COLOR)\ngl_FragColor=vec4(tex_l.r,(tex_l.g+tex_r.g)/2.0,tex_r.b,1);\n#elif defined(STEREO_RED_CYAN)\ngl_FragColor=vec4(tex_l.r,tex_r.g,tex_r.b,1);\n#elif defined(STEREO_DIFFERENCE)\ngl_FragColor=vec4(tex_l.r,0,tex_r.b,1);\n#elif defined(STEREO_LEFT_RIGHT)\nif(vUv.x<0.5){gl_FragColor=tex_l;}else{gl_FragColor=tex_r;}\n#endif\n}"; // eslint-disable-line

  var vert = "#define GLSLIFY 1\nvarying vec2 vUv;void main(){vUv=uv;vec4 modelViewPosition=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*modelViewPosition;}"; // eslint-disable-line

  var Uniforms = {
    colorTexture: {
      value: null
    },
    quiltRows: {
      value: 0
    },
    quiltColumns: {
      value: 0
    },
    quiltViewWidth: {
      value: 0
    },
    quiltViewHeight: {
      value: 0
    },
    quiltAngle: {
      value: 0
    },
    quiltStereoEyeDistance: {
      value: 0
    }
  };

  exports.SpatialType = void 0;

  (function (SpatialType) {
    SpatialType[SpatialType["LOOKING_GLASS"] = 0] = "LOOKING_GLASS";
  })(exports.SpatialType || (exports.SpatialType = {}));

  exports.StereoMode = void 0;

  (function (StereoMode) {
    StereoMode[StereoMode["OFF"] = 0] = "OFF";
    StereoMode[StereoMode["COLOR"] = 1] = "COLOR";
    StereoMode[StereoMode["RED_CYAN"] = 2] = "RED_CYAN";
    StereoMode[StereoMode["DIFFERENCE"] = 3] = "DIFFERENCE";
    StereoMode[StereoMode["LEFT_RIGHT"] = 4] = "LEFT_RIGHT";
  })(exports.StereoMode || (exports.StereoMode = {}));

  class QuiltConfig {
    constructor() {
      this.angle = 0;
      this.stereoEyeDistance = 8;
      this.rows = 8;
      this.columns = 8;
      this.width = 480;
      this.height = 640;
    }

  }

  class Props {
    constructor() {
      this.spatialType = exports.SpatialType.LOOKING_GLASS;
      this.quilt = null;
      this.stereoMode = exports.StereoMode.COLOR;
    }

  }

  class Player extends three.Object3D {
    constructor(texture, depth, props) {
      super();
      /** Assign the user provided props, if any */

      this.props = new Props();
      this.material = new three.ShaderMaterial({
        uniforms: Uniforms,
        vertexShader: vert,
        fragmentShader: frag,
        transparent: true,
        side: three.FrontSide
      });
      this.setProps(this.props, props);
      /** Add the compiler definitions needed to pick the right GLSL methods */

      this.setShaderDefines(this.shaderDefines);
      /**
       * Create the geometry only once, it can be shared between instances
       *  of the viewer since it's kept as a static class member
       **/

      if (!Player.geometry) {
        Player.geometry = new three.PlaneBufferGeometry(1, 1); // Player.geometry.scale(this.aspectRatio, 1, 1);

        this.scale.x = this.aspectRatio;
      }
      /** Assign the textures and update the shader uniforms */


      this.assignTexture(texture);
      this.updateUniforms();
      /** Create the Mesh/Points and add it to the viewer object */

      super.add(this.createMesh(Player.geometry, this.material));
    }

    createMesh(geo, mat) {
      return new three.Mesh(geo, mat);
    }
    /** Internal util to assign the textures to the shader uniforms */


    assignTexture(tex) {
      this.texture = this.setDefaultTextureProps(tex);
    }

    clearDefines(defines) {
      var _this = this;

      defines.forEach(function (define) {
        delete _this.material.defines[define];
      });
      this.material.needsUpdate = true;
    }

    setShaderDefines(defines) {
      var _this2 = this;

      defines.forEach(function (define) {
        if (define) {
          _this2.material.defines[define] = '';
        }
      });
      this.material.needsUpdate = true;
    }
    /** Internal util to set viewer props from config object */


    setProps(viewerProps, userProps) {
      if (!userProps) return;
      /** Iterate over user provided props and assign to viewer props */

      for (var prop in userProps) {
        if (prop in viewerProps) {
          viewerProps[prop] = userProps[prop];
        } else {
          console.warn("SpatialViewer: Provided ".concat(prop, " in config but it is not a valid property and wiill be ignored"));
        }
      }
    }

    setDefaultTextureProps(texture) {
      texture.format = three.RGBFormat;
      texture.generateMipmaps = true;
      texture.wrapS = three.RepeatWrapping;
      texture.wrapT = three.RepeatWrapping;
      return texture;
    }

    updateUniforms() {
      this.material.uniforms.quiltStereoEyeDistance.value = this.props.quilt.stereoEyeDistance;
      this.material.uniforms.quiltAngle.value = this.props.quilt.angle;
      this.material.uniforms.quiltColumns.value = this.props.quilt.columns;
      this.material.uniforms.quiltRows.value = this.props.quilt.rows;
    }

    dispose() {
      if (this.material) {
        Player.geometry.dispose();
        this.material.dispose();
        this.texture.dispose();
      }
    }

    get shaderDefines() {
      return [exports.SpatialType[this.props.spatialType], "STEREO_" + exports.StereoMode[this.props.stereoMode], this.props.stereoMode == exports.StereoMode.OFF ? null : "STEREO_ON"];
    }

    get spatial() {
      return this.props.spatialType;
    }

    set spatial(val) {
      this.clearDefines(this.shaderDefines);
      this.props.spatialType = val;
      this.setShaderDefines(this.shaderDefines);
    }

    get stereoMode() {
      return this.props.stereoMode;
    }

    set stereoMode(val) {
      this.clearDefines(this.shaderDefines);
      this.props.stereoMode = val;
      this.setShaderDefines(this.shaderDefines);
      this.scale.set(this.aspectRatio, 1, 1);
    }

    get aspectRatio() {
      if (this.props.stereoMode == exports.StereoMode.LEFT_RIGHT) {
        return this.props.quilt.width * 2.0 / this.props.quilt.height;
      }

      return this.props.quilt.width / this.props.quilt.height;
    }

    get quiltAngle() {
      return this.props.quilt.angle;
    }

    set quiltAngle(val) {
      this.props.quilt.angle = val;
      this.updateUniforms();
    }

    get quiltStereoEyeDistance() {
      return this.props.quilt.stereoEyeDistance;
    }

    set quiltStereoEyeDistance(val) {
      this.props.quilt.stereoEyeDistance = val;
      this.updateUniforms();
    }

    get quiltWidth() {
      return this.props.quilt.width;
    }

    set quiltWidth(val) {
      this.props.quilt.width = val;
      this.updateUniforms();
    }

    set quiltHeight(val) {
      this.props.quilt.height = val;
      this.updateUniforms();
    }

    get quiltHeight() {
      return this.props.quilt.height;
    }

    set quiltRows(val) {
      this.props.quilt.rows = val;
      this.updateUniforms();
    }

    get quiltRows() {
      return this.props.quilt.rows;
    }

    set quiltColumns(val) {
      this.props.quilt.columns = val;
      this.updateUniforms();
    }

    get quiltColumns() {
      return this.props.quilt.columns;
    }

    set texture(map) {
      this.material.uniforms.colorTexture.value = map;
    }

    get texture() {
      return this.material.uniforms.colorTexture.value;
    }

  }
  Player.geometry = void 0;

  exports.Player = Player;
  exports.Props = Props;
  exports.QuiltConfig = QuiltConfig;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=three-spatial-viewer.amd.js.map
