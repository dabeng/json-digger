const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'json-digger.js',
    globalObject: 'this',
    library: {
      name: 'JSONDigger',
      type: 'umd',
    },
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  mode: "development",
  resolve: {
    fallback: {
      "assert": false,
      "buffer": false,
      "child_process": false,
      "constants": false,
      "crypto": false,
      "esbuild": false,
      "fs": false,
      "http": false,
      "https": false,
      "inspector": false,
      "module": false,
      "os": false,
      "path": false,
      "querystring": false,
      "stream": false,
      "uglify-js": false,
      "url": false,
      "util": false,
      "vm": false,
      "worker_threads": false,
      "zlib": false,
      "@swc/core": false
    } 
  },
};