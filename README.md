# HtmlBunPlugin
A quick and dirty analogue to HtmlWebpackPlugin for Bun's bundler. 

## Build

Install dependencies:

```bash
bun install
```

To build:

```bash
bun run build
```

## Usage

In a build file, import the HtmlBunPlugin factory, and add it to the plugin list when you run `Bun.build`:
```js
// build.js
import HtmlBunPlugin from 'somewhere'

Bun.build({
  entrypoints: ['src/index.js'],
  outdir: './out',
  plugins: [HtmlBunPlugin({
    // optional config can include a name for the generated .html file in the outdir:
    filename: 'whatever-you-want.html'
  })]
})
```
This project was created using `bun init` in bun v1.0.1. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
