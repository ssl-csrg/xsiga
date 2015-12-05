module.exports = {
  entry: {
    'ext/content': './extension/scripts/content.js',
    'ext/background': './extension/scripts/background.js',
    'client/bundle': './client/src/index.js'
  },
  output: {
    path: 'tmp',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.vue$/,
        loader: 'vue'
      }
    ]
  }
}
