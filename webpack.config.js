module.exports = {
  entry: {
    content: './src/scripts/content.js',
    background: './src/scripts/background.js',
    bundle: './src/popup/entry.js'
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
      }
    ]
  }
}
