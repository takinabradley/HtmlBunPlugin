// @bun
// src/default.html
var default_default = "./default-66fbc1e590c0cb2c.html";

// src/HtmlBunPlugin.ts
import fs from "fs/promises";

// src/createHtmlCloneWithScriptTags.ts
var addScriptTags = function(el, entrypoints, insertComments = true) {
  const fileNames = filePathsToFileNames(entrypoints);
  const scriptTags = fileNames.map((fileName) => `  <script src='./${fileName}' type='module'></script>\n`);
  if (insertComments)
    el.append("  <!-- The following <script> tags added via HTMLBunPlugin -->\n", { html: true });
  scriptTags.forEach((script) => el.append(script, { html: true }));
  if (insertComments)
    el.append("  <!-- End of HtmlBunPlugin script tags -->\n", { html: true });
};
var addTitleTag = function(el, title, insertComments = true) {
  if (insertComments)
    el.append("  <!-- The following <title> added via HtmlBunPlugin -->\n", { html: true });
  el.append(`  <title>${title}</title>\n`, { html: true });
};
var filePathsToFileNames = function(filePaths) {
  return filePaths.map((entry) => {
    const lastIndexOfSlash = entry.lastIndexOf("/");
    return lastIndexOfSlash >= 0 ? entry.slice(entry.lastIndexOf("/") + 1) : entry;
  });
};
var rewriter = new HTMLRewriter;
async function createHtmlCloneWithScriptTags(htmlFilePath, entrypoints, fileName, title) {
  const headElementHandler = {
    element(el) {
      if (el.tagName !== "head")
        return;
      addScriptTags(el, entrypoints);
      if (title)
        addTitleTag(el, title);
    }
  };
  const bunFileUrl = Bun.pathToFileURL(htmlFilePath).href;
  const originalHtmlRes = await fetch(bunFileUrl);
  const newHtmlRes = rewriter.on("head", headElementHandler).transform(originalHtmlRes);
  const newHtmlBlob = await newHtmlRes.blob();
  return new File([newHtmlBlob], fileName, { type: newHtmlBlob.type });
}

// src/HtmlBunPlugin.ts
var HtmlBunPlugin = function(config = { filename: "index.html", title: "Bun App" }) {
  return {
    name: "HtmlBunPlugin",
    async setup(build) {
      if (!build.config.outdir)
        return;
      const outdir = build.config.outdir;
      const file = await createHtmlCloneWithScriptTags(config.template || default_default, build.config.entrypoints, config.filename, config.title);
      try {
        await fs.writeFile(`${outdir}/${config.filename}`, await file.arrayBuffer());
      } catch {
        await fs.mkdir(outdir, { recursive: true });
        await fs.writeFile(`${outdir}/${config.filename}`, await file.arrayBuffer());
      }
    }
  };
};
var HtmlBunPlugin_default = HtmlBunPlugin;
export {
  HtmlBunPlugin_default as default
};
