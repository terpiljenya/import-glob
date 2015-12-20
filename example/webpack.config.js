module.exports = {
  context: __dirname,
  entry: './test.js',
  output: {
    path: __dirname,
    filename: 'output.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel?presets[]=es2015', __dirname + '/../']
      }
    ]
  }
};
