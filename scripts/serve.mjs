import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve } from "node:path";

const base = resolve(import.meta.dirname, "..");
const port = Number(process.env.PORT || 4173);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".png": "image/png", ".json": "application/json" };

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
    let target = resolve(base, `.${pathname === "/" ? "/index.html" : pathname}`);
    if (!target.startsWith(base)) throw new Error("invalid path");
    try { if ((await stat(target)).isDirectory()) target = resolve(target, "index.html"); }
    catch { if (!extname(target)) target += ".html"; }
    const body = await readFile(target);
    response.writeHead(200, { "Content-Type": types[extname(target)] || "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    response.end(await readFile(resolve(base, "404.html")));
  }
}).listen(port, "127.0.0.1", () => console.log(`Site local em http://127.0.0.1:${port}`));
