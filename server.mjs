import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, sep, extname } from "node:path";

const root = fileURLToPath(new URL("./dist/", import.meta.url));
const productUrl =
  "https://app.econverse.com.br/teste-front-end/junior/tecnologia/lista-produtos/produtos.json";
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".jpg": "image/jpeg",
};

createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    if (pathname === "/api/produtos") {
      const upstream = await fetch(productUrl, {
        signal: AbortSignal.timeout(8000),
      });
      if (!upstream.ok) throw new Error("Catálogo indisponível");
      response.writeHead(200, {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60",
      });
      response.end(
        request.method === "HEAD" ? undefined : await upstream.text(),
      );
      return;
    }
    const file = resolve(
      root,
      `.${pathname === "/" ? "/index.html" : pathname}`,
    );
    if (!file.startsWith(root.endsWith(sep) ? root : root + sep)) {
      response.writeHead(403).end();
      return;
    }
    const content = await readFile(file);
    response.writeHead(200, {
      "Content-Type": mime[extname(file)] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(request.method === "HEAD" ? undefined : content);
  } catch {
    response
      .writeHead(request.url?.startsWith("/api/") ? 502 : 404)
      .end("Recurso indisponível");
  }
}).listen(Number(process.env.PORT || 4173), "127.0.0.1", () => {
  console.log(
    `Econverse disponível em http://127.0.0.1:${process.env.PORT || 4173}`,
  );
});
