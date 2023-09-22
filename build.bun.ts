import CopyBunPlugin from '@takinabradley/copybunplugin'

Bun.build({
  entrypoints: ['src/HtmlBunPlugin.ts'],
  outdir: './out',
  target: 'bun',
  plugins: [
    CopyBunPlugin({
      patterns: [
        {from: 'src/default.html'}
      ]
    })
  ]
})