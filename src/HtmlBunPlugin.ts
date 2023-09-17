import type { BunPlugin, PluginBuilder } from 'bun'
import defautHtmlPath from './default.html'
import fs from 'node:fs/promises'
import createHtmlCloneWithScriptTags from './createHtmlCloneWithScriptTags'

export interface HtmlBunPluginConfig {
  filename: string
  title?: string
  template?: string
}

/**
 *
 * @param {HtmlBunPluginConfig} config - optional options object
 * - filename: Defaults to 'index.html'. Required if passing in an options object.
 * - title?: adds a title tag with the provided string. Defaults to 'Bun App'
 * - template?: path to a template HTML file to inject entries and title into
 */
function HtmlBunPlugin (config: HtmlBunPluginConfig = { filename: 'index.html', title: 'Bun App' }): BunPlugin {
  return {
    name: 'HtmlBunPlugin',
    async setup (build: PluginBuilder) {
      if (build.config.outdir === undefined) return

      const outdir = build.config.outdir
      const file = await createHtmlCloneWithScriptTags(
        config.template ?? defautHtmlPath as string, // defautHtmlPath should always exist
        build.config.entrypoints,
        config.filename,
        config.title
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
