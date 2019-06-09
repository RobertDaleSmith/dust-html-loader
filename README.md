# [dust](https://github.com/linkedin/dustjs) to html loader for [webpack](http://webpack.github.io/)

Compiles dust templates with partials and exports the compiled HTML, allowing for rendering of the templates to static html files with [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) or passing on to html-loader.

Built for use with the [webpack-dev-server](https://github.com/webpack/webpack-dev-server) testing environment in mind.

## Usage
```
plugins: [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: '!!dust-html-loader!src/views/index.dust'
  }),
]
```
OR

```
plugins: [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: '!!html-loader!dust-html-loader?preLoader=true!src/views/index.dust'
  }),
]
```

## Thanks 🙏♥️

Examples and code fragments used from both [dust-loader](https://github.com/avaly/dust-loader) and [dust-loader-complete](https://github.com/wombatsecurity/dust-loader-complete).
