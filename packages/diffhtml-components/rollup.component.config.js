import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import Visualizer from 'rollup-plugin-visualizer';

const entries = {
  min: 'lib/component.js',
  umd: 'lib/component.js',
};

const dests = {
  min: 'dist/component.min.js',
  umd: 'dist/component.js',
}

const { NODE_ENV = 'umd' } = process.env;

export default {
  input: entries[NODE_ENV],
  context: 'this',
  external: ['diffhtml'],

  output: [{
    file: dests[NODE_ENV],
    format: 'umd',
    exports: 'default',
    name: 'Component',
    sourcemap: false,
    globals: { diffhtml: 'diff' },
  }],

  plugins: [
    NODE_ENV === 'min' && replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    babel(),
    nodeResolve({ mainFields: ['main', 'module'] }),
    commonjs({ include: 'node_modules/**', }),
    NODE_ENV === 'umd' && Visualizer({ filename: './dist/component-build-size.html' }),
  ].filter(Boolean),
};
