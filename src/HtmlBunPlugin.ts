import type { BunPlugin, PluginBuilder } from "bun";
import fs from 'node:fs/promises'

const filePathsToFileNames = (entrypoints: string[]) => 
  entrypoints.map(entry => entry.slice(entry.lastIndexOf('/') + 1))

function createDefaultHTML(entrypoints: string[]) {
  const fileNames = filePathsToFileNames(entrypoints)
  const scriptTags = 
    fileNames
      .map(fileName => `\n  <script src='./${fileName}' type='module'></script>`)
      .join('')

  const  defaultHTML = 
`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>${scriptTags}
</head>
<body>
  
</body>
</html>`

  return new File([defaultHTML], 'index.html', {type: "text/html"})
}

type HtmlBunPluginConfig = {
  filename?: string,
  title?: string
}

function HtmlBunPlugin(config: HtmlBunPluginConfig = {filename: 'index.html', title:'Bun App'}): BunPlugin {
  return {
    name: "HtmlBunPlugin",
    async setup(build: PluginBuilder) {
      if(!build.config.outdir) return

      const outdir = build.config.outdir
      const file = createDefaultHTML(build.config.entrypoints)
      try {
        await fs.writeFile(`${outdir}/${config.filename}`, await file.arrayBuffer())
      } catch {
        await fs.mkdir(outdir)
        await fs.writeFile(`${outdir}/${config.filename}`, await file.arrayBuffer())
      }
    }
  }
}

export default HtmlBunPlugin