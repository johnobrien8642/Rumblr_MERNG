module.exports = {
  mode: 'development',
  entry: './client/src/index.js',
  output: {
    path: '/',
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/
      },
      {
        use: ['style-loader', 'css-loader'],
        test: /\.css$/
      }
    ]
  }
}