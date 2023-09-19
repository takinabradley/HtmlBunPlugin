const rewriter = new HTMLRewriter()

export default async function createHtmlCloneWithScriptTags (
  htmlFilePath: string,
  entrypoints: string[],
  fileName: string,
  title?: string
): Promise<File> {
  const headElementHandler = {
    element (el: HTMLRewriterTypes.Element) {
      if (el.tagName !== 'head') return

      addScriptTags(el, entrypoints)
      // add title element
      if (title !== undefined) addTitleTag(el, title)
    }
  }

  const bunFileUrl = Bun.pathToFileURL(htmlFilePath).href
  const originalHtmlRes = await fetch(bunFileUrl)
  const newHtmlRes: Response = rewriter.on('head', headElementHandler).transform(originalHtmlRes)
  const newHtmlBlob = await newHtmlRes.blob()
  return new File([newHtmlBlob], fileName, { type: newHtmlBlob.type })
}

function addScriptTags (el: HTMLRewriterTypes.Element, entrypoints: string[], insertComments: boolean = true): void {
  // add sript tags for entry points
  const fileNames = parseScriptNamesFromEntryPoints(entrypoints) // replaceExtensionsWithJs(filePathsToFileNames(entrypoints))
  const scriptTags = fileNames.map(fileName =>
    `  <script src='./${fileName}' defer></script>\n`
  )

  if (insertComments) el.append('  <!-- The following <script> tags added via HTMLBunPlugin -->\n', { html: true })
  scriptTags.forEach(script => el.append(script, { html: true }))
  if (insertComments) el.append('  <!-- End of HtmlBunPlugin script tags -->\n', { html: true })
}

function addTitleTag (el: HTMLRewriterTypes.Element, title: string, insertComments: boolean = true): void {
  if (insertComments) el.append('  <!-- The following <title> added via HtmlBunPlugin -->\n', { html: true })
  el.append(`  <title>${title}</title>\n`, { html: true })
}

function filePathToFileName (path: string): string {
  const lastIndexOfSlash = path.lastIndexOf('/')
  return (
    lastIndexOfSlash >= 0 ? path.slice(lastIndexOfSlash + 1) : path
  )
}

function replaceFileExtension (newExtension: string, filename: string): string {
  if (filename.endsWith(newExtension)) return filename
  const lastIndexOfDot = filename.lastIndexOf('.')
  return lastIndexOfDot !== -1 ? `${filename.slice(0, lastIndexOfDot) + newExtension}` : `${filename + newExtension}`
}

function parseScriptNamesFromEntryPoints (entrypoints: string[]): string[] {
  return entrypoints.map(entryPath =>
    replaceFileExtension('.js', filePathToFileName(entryPath))
  )
}
