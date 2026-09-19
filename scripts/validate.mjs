import { readFile, access } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import vm from "node:vm";

const base = resolve(import.meta.dirname, "..");
const errors = [];
const context = { window: {} };
vm.createContext(context);
vm.runInContext(await readFile(resolve(base, "assets/js/data.js"), "utf8"), context);
vm.runInContext(await readFile(resolve(base, "assets/js/property-galleries.js"), "utf8"), context);
const data = context.window.SITE_DATA;
const galleries = context.window.PROPERTY_GALLERIES;

if (!data || data.properties.length !== 10) errors.push("A seleção precisa conter exatamente 10 empreendimentos.");
if (new Set(data.properties.map(({ slug }) => slug)).size !== 10) errors.push("Os slugs dos empreendimentos precisam ser únicos.");
if (!galleries || Object.keys(galleries).length !== 10) errors.push("As galerias oficiais precisam cobrir os 10 empreendimentos.");
for (const property of data.properties) {
  if (!galleries?.[property.slug]?.length) errors.push(`Galeria oficial ausente: ${property.slug}`);
}

const requiredPages = ["index.html", "trajetoria.html", "resultados.html", "equipe.html", "imoveis.html", "trabalhe-comigo.html", "contato.html", "politica-de-privacidade.html", "404.html"];
for (const file of requiredPages) {
  try { await access(resolve(base, file)); } catch { errors.push(`Página ausente: ${file}`); }
}

for (const property of data.properties) {
  const file = `imoveis/${property.slug}.html`;
  try {
    const html = await readFile(resolve(base, file), "utf8");
    if (!html.includes(`data-slug="${property.slug}"`)) errors.push(`Slug incorreto em ${file}`);
  } catch { errors.push(`Página de empreendimento ausente: ${file}`); }
}

const htmlFiles = [...requiredPages.filter((name) => name !== "404.html"), ...data.properties.map(({ slug }) => `imoveis/${slug}.html`)];
for (const file of htmlFiles) {
  const html = await readFile(resolve(base, file), "utf8");
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`Title ausente em ${file}`);
  if (!/<meta name="description" content="[^"]+">/.test(html)) errors.push(`Description ausente em ${file}`);
  for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
    const value = match[1];
    if (/^(https?:|mailto:|tel:)/.test(value) || value.startsWith("/api/")) continue;
    const cleanValue = value.split("?")[0];
    const local = value.startsWith("/") ? resolve(base, cleanValue.slice(1)) : resolve(base, dirname(file), cleanValue);
    try { await access(local); } catch { errors.push(`Referência local inválida em ${file}: ${value}`); }
  }
}

const home = await readFile(resolve(base, "index.html"), "utf8");
for (const proof of ["+700", "+R$ 500 mi", "14 anos", "Top 5"]) {
  if (!home.includes(proof)) errors.push(`Indicador ausente na home: ${proof}`);
}

const siteScript = await readFile(resolve(base, "assets/js/site.js"), "utf8");
if (/href\s*=\s*["'`]https:\/\/www\.dialogo\.com\.br/i.test(siteScript) || siteScript.includes('href="${property.source}')) {
  errors.push("O site não deve criar redirecionamentos para a Diálogo.");
}

const form = await readFile(resolve(base, "trabalhe-comigo.html"), "utf8");
for (const field of ["nome", "whatsapp", "email", "creci", "regiao", "interesse", "experiencia", "disponibilidade", "mensagem", "consentimento"]) {
  if (!form.includes(`name="${field}"`)) errors.push(`Campo ausente no formulário: ${field}`);
}

if (errors.length) {
  console.error(`Validação falhou com ${errors.length} erro(s):\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

const galleryCount = Object.values(galleries).reduce((total, items) => total + items.length, 0);
console.log(`Validação concluída: ${requiredPages.length} páginas institucionais, 10 empreendimentos, ${galleryCount} imagens oficiais e formulário profissional íntegros.`);
