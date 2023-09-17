const rewriter = new HTMLRewriter()

export default async function createHtmlCloneWithScriptTags(
  htmlFilePath: string, 
  entrypoints: string[], 
  fileName: string, 
  title?: string
) {
  const headElementHandler = {
    element(el: HTMLRewriterTypes.Element) {
      if (el.tagName !== "head") return;
      
      addScriptTags(el, entrypoints)
      // add title element 
      if(title) addTitleTag(el, title)
    }
  };

  const bunFileUrl = Bun.pathToFileURL(htmlFilePath).href;
  const originalHtmlRes = await fetch(bunFileUrl);
  const newHtmlRes: Response = rewriter.on('head', headElementHandler).transform(originalHtmlRes)
  const newHtmlBlob = await newHtmlRes.blob()
  return new File([newHtmlBlob], fileName, {type: newHtmlBlob.type} as BlobPropertyBag)
}

function addScriptTags(el: HTMLRewriterTypes.Element, entrypoints: string[], insertComments: boolean = true) {
  // add sript tags for entry points
  const fileNames = filePathsToFileNames(entrypoints)
  const scriptTags = fileNames.map(fileName =>
    `  <script src='./${fileName}' type='module'></script>\n`
  )

  if(insertComments) el.append('  <!-- The following <script> tags added via HTMLBunPlugin -->\n', {html: true})
  scriptTags.forEach(script => el.append(script, {html: true}))
  if(insertComments) el.append('  <!-- End of HtmlBunPlugin script tags -->\n', {html: true})
}

function addTitleTag(el: HTMLRewriterTypes.Element, title: string, insertComments: boolean = true ) {
  if(insertComments) el.append('  <!-- The following <title> added via HtmlBunPlugin -->\n', {html: true})
  el.append(`  <title>${title}</title>\n`, {html: true})
}

function filePathsToFileNames(filePaths: string[]) { 
  return filePaths.map(entry => {
    const lastIndexOfSlash = entry.lastIndexOf('/')
    return (
      lastIndexOfSlash >= 0 ? entry.slice(entry.lastIndexOf('/') + 1) : entry
    )
  })
}