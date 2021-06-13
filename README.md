# Three.js Spatial Viewer
A spatial media viewer for displaying various kinds of spatial content. Only just started working on this and currently just supports the [Looking Glass format](https://docs.lookingglassfactory.com/keyconcepts/quilts). 

- [View example](https://caseypugh.github.io/three-spatial-viewer/examples/looking-glass.html)

### Wishlist:
Would like to support both video and static images/gifs of the following formats:
- ✔️ Looking Glass
- ❌ Stereo photos
- ❌ Stereo 360 
- ❌ Stereo 180
- ❌ RGBD/DephtKit

And be able to display them in:
- WebVR
- Anaglyph
- Classic stereo, side-by-side
- MagicEye lol

# Installation
Install in your HTML head and make sure you have also included [three.js](https://threejs.org/docs/index.html#manual/en/introduction/Installation)
```html
<script src="three-spatial-viewer.js"></script>
```

Or use ES6
```sh
yarn add https://github.com/caseypugh/three-spatial-viewer
```

And then import the plugin
```js
import { 
  Player, SpatialType, StereoMode, QuiltConfig
} from 'three-spatial-viewer'
```