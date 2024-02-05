import type { BunPlugin, PluginBuilder } from 'bun'
import fs from 'node:fs/promises'
import createHtmlCloneWithScriptTags from './createHtmlCloneWithScriptTags'

// copied to outdir via CopyBunPlugin
const defautHtmlPath: string = import.meta.dir + '/default.html'

export interface HtmlBunPluginConfig {
  filename: string
  title?: string
  template?: string
  publicPath?: string
}

/**
 *
 * @param {HtmlBunPluginConfig} config - optional options object
 * - filename: Defaults to 'index.html'. Required if passing in an options object.
 * - title?: adds a title tag with the provided string. Defaults to 'Bun App'
 * - template?: path to a template HTML file to inject entries and title into
 * - publicPath?: the base path that the entrypoint will be fetched from, defaults to './'
 */
function HtmlBunPlugin (config: HtmlBunPluginConfig = { filename: 'index.html', title: 'Bun App', publicPath: './' }): BunPlugin {
  return {
    name: 'HtmlBunPlugin',
    async setup (build: PluginBuilder) {
      if (build.config.outdir === undefined) return

      const outdir = build.config.outdir
      const file = await createHtmlCloneWithScriptTags(
        config.template ?? defautHtmlPath,
        build.config.entrypoints,
        config.filename,
        config.title,
        config.publicPath
      )

      try {
        await fs.writeFile(`${outdir}/${config.filename}`, await file.arrayBuffer())
      } catch {
        await fs.mkdir(outdir, { recursive: true })
        await fs.writeFile(`${outdir}/${config.filename}`, await file.arrayBuffer())
      }
    }
  }
}

export default HtmlBunPlugin
