uniform sampler2D colorTexture;
uniform float quiltRows;
uniform float quiltColumns;
uniform float quiltAngle;
uniform float quiltStereoEyeDistance;
uniform float u_vOffset;
uniform float u_hOffset;

varying vec2 vUv;

vec4 getQuiltViewingAngle(sampler2D tex, float angle, int stereo) {
    float stereoMulti = stereo > 0 ? 2.0 : 1.0;
    float stereoOffset = stereo == 2 && vUv.x >= 0.5 ? -0.5 : 0.0;
    return texture2D(tex, vec2((vUv.x + stereoOffset) * (1.0 / quiltColumns) * stereoMulti + mod(angle, quiltColumns) / quiltColumns, 
                               vUv.y * (1.0 / quiltRows) + floor(angle / quiltColumns) / quiltRows));
}

void main() {

#if defined(LOOKING_GLASS) && defined(STEREO_OFF)
  gl_FragColor = getQuiltViewingAngle(colorTexture, quiltAngle, 0);
#elif defined(LOOKING_GLASS) && defined(STEREO_ON)
  float total = quiltRows * quiltColumns;
  float angle = quiltAngle;
  if (angle + quiltStereoEyeDistance >= total) {
    angle = total - quiltStereoEyeDistance - 1.0;
  }
  #ifdef STEREO_LEFT_RIGHT
    vec4 tex_l = getQuiltViewingAngle(colorTexture, angle, 1);
    vec4 tex_r = getQuiltViewingAngle(colorTexture, angle + quiltStereoEyeDistance, 2);
  #else
    vec4 tex_l = getQuiltViewingAngle(colorTexture, angle, 0);
    vec4 tex_r = getQuiltViewingAngle(colorTexture, angle + quiltStereoEyeDistance, 0);
  #endif
#elif defined(STEREO)
  vec4 tex_l = texture2D(colorTexture, vec2(vUv.x * 0.5, vUv.y));
  vec4 tex_r = texture2D(colorTexture, vec2(vUv.x * 0.5 + 0.5 + u_hOffset, vUv.y + u_vOffset));
#endif 

#if defined(STEREO_COLOR)
  gl_FragColor = vec4(tex_l.r, (tex_l.g + tex_r.g) / 2.0, tex_r.b, 1);
#elif defined(STEREO_RED_CYAN)
  gl_FragColor = vec4(tex_l.r, tex_r.g, tex_r.b, 1);
#elif defined(STEREO_DIFFERENCE)
  gl_FragColor = vec4(tex_l.r, 0, tex_r.b, 1);
#elif defined(STEREO_LEFT_RIGHT)
  if (vUv.x < 0.5)
  {
    gl_FragColor = tex_l;
  }
  else 
  {
    gl_FragColor = tex_r;
  }
#endif
}