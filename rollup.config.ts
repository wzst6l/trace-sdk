import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import camelCase from 'lodash.camelcase'
import typescript from 'rollup-plugin-typescript2'
import json from 'rollup-plugin-json'

const pkg = require('./package.json')
const name = pkg.name
const libraryName = 'index'

export default {
  input: `src/${libraryName}.ts`,
  output: [
    {
      // file: pkg.main,
      file: `dist/${name}.umd.js`,
      name: camelCase(libraryName),
      format: 'umd',
      sourcemap: true
    },
    {
      // file: pkg.module,
      file: `dist/${name}.esm.js`,
      format: 'es',
      sourcemap: true
    },
    // {
    //   file: pkg.browser,
    //   format: 'cjs',
    //   name: camelCase(libraryName),
    //   sourcemap: true
    // }
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: ['lodash'],
  watch: {
    include: 'src/**',
  },
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs({
      exclude: 'node_modules'
    }),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),
    // commonjs({
    //   exclude: 'node_modules'
    // }),
    // Resolve source maps to the original source
    sourceMaps(),
  ],
}
