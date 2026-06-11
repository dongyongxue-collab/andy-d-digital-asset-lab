import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(rootDir, "dist");
const htmlPath = resolve(distDir, "index.html");

let html = await readFile(htmlPath, "utf8");
const assets = [];

html = await replaceAsync(
  html,
  /<link\s+rel="stylesheet"[^>]*href="\.\/([^"]+\.css)"[^>]*>/g,
  async (_tag, assetPath) => {
    const css = await readFile(resolve(distDir, assetPath), "utf8");
    assets.push({
      type: "style",
      path: assetPath,
      source: Buffer.from(css, "utf8").toString("base64")
    });
    return "";
  }
);

html = await replaceAsync(
  html,
  /<script\s+type="module"[^>]*src="\.\/([^"]+\.js)"[^>]*><\/script>/g,
  async (_tag, assetPath) => {
    const js = await readFile(resolve(distDir, assetPath), "utf8");
    assets.push({
      type: "script",
      path: assetPath,
      source: Buffer.from(js, "utf8").toString("base64")
    });
    return "";
  }
);

if (assets.length) {
  const payload = Buffer.from(JSON.stringify(assets), "utf8").toString("base64");
  const bootstrap = `<script data-standalone="true">
(() => {
  const payload = "${payload}";
  const decoder = new TextDecoder();
  const decode = (value) => decoder.decode(Uint8Array.from(atob(value), (char) => char.charCodeAt(0)));
  const assets = JSON.parse(decode(payload));

  for (const asset of assets) {
    if (asset.type === "style") {
      const style = document.createElement("style");
      style.dataset.inline = asset.path;
      style.textContent = decode(asset.source);
      document.head.appendChild(style);
    }
  }

  for (const asset of assets) {
    if (asset.type !== "script") continue;
    const script = document.createElement("script");
    script.type = "module";
    script.dataset.inline = asset.path;
    script.textContent = decode(asset.source);
    document.body.appendChild(script);
  }
})();
</script>`;

  html = html.replace("</body>", `    ${bootstrap}\n  </body>`);
}

await writeFile(htmlPath, html, "utf8");

async function replaceAsync(source, pattern, replacer) {
  const matches = [...source.matchAll(pattern)];
  const replacements = await Promise.all(matches.map((match) => replacer(...match)));
  let output = source;

  for (let index = matches.length - 1; index >= 0; index -= 1) {
    const match = matches[index];
    const replacement = replacements[index];
    output = output.slice(0, match.index) + replacement + output.slice(match.index + match[0].length);
  }

  return output;
}
