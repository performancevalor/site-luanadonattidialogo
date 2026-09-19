import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile(new URL("../assets/js/data.js", import.meta.url), "utf8");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(source, context);

const decode = (value = "") => value
  .replaceAll("&quot;", '"')
  .replaceAll("&#039;", "'")
  .replaceAll("&amp;", "&")
  .replace(/<[^>]+>/g, "")
  .replace(/\s+/g, " ")
  .trim();

const galleries = {};

for (const property of context.window.SITE_DATA.properties) {
  const response = await fetch(property.source, {
    headers: { "user-agent": "Mozilla/5.0 LuanaDonattiSite/1.0" },
  });
  if (!response.ok) throw new Error(`${property.slug}: HTTP ${response.status}`);
  const html = await response.text();
  const start = html.indexOf('<section class="gallery');
  const end = start >= 0 ? html.indexOf("</section>", start) : -1;
  const block = start >= 0 ? html.slice(start, end >= 0 ? end + 10 : html.length) : "";
  const items = [];
  const seen = new Set();

  for (const match of block.matchAll(/<a\b[^>]*data-fancybox="gallery-[^"]+"[^>]*>/gi)) {
    const tag = match[0];
    const url = tag.match(/href\s*=\s*"(https:\/\/www\.dialogo\.com\.br\/estatico\/[^"]+\.(?:jpe?g|png|webp))"/i)?.[1];
    const category = tag.match(/data-fancybox\s*=\s*"gallery-([^"]+)"/i)?.[1];
    const caption = decode(tag.match(/data-caption\s*=\s*"([\s\S]*?)"/i)?.[1]);
    if (!url || seen.has(url)) continue;
    seen.add(url);
    items.push({ url, category: decode(category).replaceAll("-", " "), caption: caption || property.shortName });
  }

  galleries[property.slug] = items.length
    ? items
    : [{ url: property.image, category: "empreendimento", caption: property.shortName }];
  console.log(`${property.slug}: ${galleries[property.slug].length} imagens`);
}

const output = `window.PROPERTY_GALLERIES = ${JSON.stringify(galleries, null, 2)};\n`;
await fs.writeFile(new URL("../assets/js/property-galleries.js", import.meta.url), output, "utf8");
