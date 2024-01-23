// @bun
// src/HtmlBunPlugin.ts
import fs from "fs/promises";

// src/createHtmlCloneWithScriptTags.ts
var addScriptTags = function(el, entrypoints, insertComments = true) {
  const fileNames = parseScriptNamesFromEntryPoints(entrypoints);
  const scriptTags = fileNames.map((fileName) => `  <script src='./${fileName}' defer></script>\n`);
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
var filePathToFileName = function(path) {
  const lastIndexOfSlash = path.lastIndexOf("/");
  return lastIndexOfSlash >= 0 ? path.slice(lastIndexOfSlash + 1) : path;
};
var replaceFileExtension = function(newExtension, filename) {
  if (filename.endsWith(newExtension))
    return filename;
  const lastIndexOfDot = filename.lastIndexOf(".");
  return lastIndexOfDot !== -1 ? `${filename.slice(0, lastIndexOfDot) + newExtension}` : `${filename + newExtension}`;
};
var parseScriptNamesFromEntryPoints = function(entrypoints) {
  return entrypoints.map((entryPath) => replaceFileExtension(".js", filePathToFileName(entryPath)));
};
async function createHtmlCloneWithScriptTags(htmlFilePath, entrypoints, fileName, title) {
  const rewriter = new HTMLRewriter;
  const headElementHandler = {
    element(el) {
      if (el.tagName !== "head")
        return;
      addScriptTags(el, entrypoints);
      if (title !== undefined)
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
      if (build.config.outdir === undefined)
        return;
      const outdir = build.config.outdir;
      const file = await createHtmlCloneWithScriptTags(config.template ?? defautHtmlPath, build.config.entrypoints, config.filename, config.title);
      try {
        await fs.writeFile(`${outdir}/${config.filename}`, await file.arrayBuffer());
      } catch {
        await fs.mkdir(outdir, { recursive: true });
        await fs.writeFile(`${outdir}/${config.filename}`, await file.arrayBuffer());
      }
    }
  };
};
var defautHtmlPath = import.meta.dir + "/default.html";
var HtmlBunPlugin_default = HtmlBunPlugin;
export {
  HtmlBunPlugin_default as default
};
