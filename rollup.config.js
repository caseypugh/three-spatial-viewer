import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import { eslint } from 'rollup-plugin-eslint'
import { terser } from 'rollup-plugin-terser'
import glslify from 'rollup-plugin-glslify'

const extensions = ['.js', '.ts']

const commonPlugins = () => [
  resolve({ extensions }),
  eslint({
    include: 'src/*'
  }),
  babel({ extensions, include: ['src/**/*'] }),
  glslify({
    basedir: 'src/shaders',
    exclude: 'node_modules/**'
  })
]

const makeOutput = (name, format) => ({
  file: name,
  format: format,
  name: 'SpatialViewer',
  exports: 'named',
  sourcemap: true,
  globals: { three: 'THREE' }
})

const config = [
  {
    input: 'src/index.ts',
    output: [
      makeOutput(`dist/three-spatial-viewer.js`, 'umd'),
      makeOutput(`dist/three-spatial-viewer.amd.js`, 'amd'),
      makeOutput(`dist/three-spatial-viewer.esm.js`, 'esm')
    ],
    external: ['three'],
    plugins: commonPlugins()
  },
  {
    input: 'src/index.ts',
    output: [
      makeOutput(`dist/three-spatial-viewer.min.js`, 'umd'),
      makeOutput(`dist/three-spatial-viewer.amd.min.js`, 'amd'),
      makeOutput(`dist/three-spatial-viewer.esm.min.js`, 'esm')
    ],
    external: ['three'],
    plugins: [
      ...commonPlugins(),
      terser()
    ]
  }
]

module.exports = config