module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.stories\.tsx?$/,
    loaders: require.resolve('@storybook/source-loader'),
    enforce: 'pre',
    options: {
      parser: "typescript"
    }
  });
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('ts-loader'),
      },
      {
        loader: require.resolve('react-docgen-typescript-loader'),
        options: {
          propFilter: prop => {
            if (prop.parent) {
              return !prop.parent.fileName.includes('node_modules')
            }
            return true
          }
        }
      }
    ],
  });
  config.resolve.extensions.push('.ts', '.tsx');

  config.module.rules.push({
    test: /\.scss$/,
    use: [
      'style-loader',
      'css-loader',
      'sass-loader'
    ]
  })
  return config;
};