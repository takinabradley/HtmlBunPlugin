# HtmlBunPlugin
A quick and dirty analogue to HtmlWebpackPlugin for Bun's bundler. 

## Installation
```
bun install @takinabradley/htmlbunplugin
```
## Usage

In a build file, import the HtmlBunPlugin factory, and add it to the plugin list when you run `Bun.build`:
```js
// build.js in root of project
import HtmlBunPlugin from '@takinabradley/htmlbunplugin'
import templateHtmlPath from './src/index.html'

Bun.build({
  entrypoints: ['src/index.js'],
  outdir: './out',
  plugins: [HtmlBunPlugin({
    // Accepts an optional config object
    filename: 'whatever-you-want.html', // defaults to index.html
    title: 'My App', // defaults to 'Bun App'
    template: templateHtmlPath // provide a template .html file to inject scripts and title into
  })]
})
```

## Contributing

### Building
If you'd like to help contribute to additional features, you can build a new version of the plugin from `src/` with the following command:
```
bun run build
```

Make sure you install dependencies first with 
```
bun install
```

This project was created using `bun init` in bun v1.0.1. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
