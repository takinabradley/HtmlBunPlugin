import type { BunPlugin } from "bun";

export interface HtmlBunPluginConfig {
  filename: string;
  title?: string;
  template?: string;
  publicPath?: string;
}
/**
 *
 * @param {HtmlBunPluginConfig} config - optional options object
 * - filename: Defaults to 'index.html'. Required if passing in an options object.
 * - title?: adds a title tag with the provided string. Defaults to 'Bun App'
 * - template?: path to a template HTML file to inject entries and title into
 * - publicPath?: the base path that the entrypoint will be fetched from, defaults to './'
 */
declare function HtmlBunPlugin(config?: HtmlBunPluginConfig): BunPlugin;

export default HtmlBunPlugin;
