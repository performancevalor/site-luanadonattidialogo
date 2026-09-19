const SCRIPT_URL = process.env.APPS_SCRIPT_URL;

const fields = ["nome", "whatsapp", "email", "creci", "regiao", "interesse", "experiencia", "disponibilidade", "mensagem", "consentimento"];

function clean(value, max = 500) {
  const normalized = String(value ?? "").trim().replace(/[<>]/g, "").slice(0, max);
  return /^[=+\-@]/.test(normalized) ? `'${normalized}` : normalized;
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ ok: false, error: "Método não permitido." });
  if (!SCRIPT_URL) return response.status(503).json({ ok: false, error: "Integração temporariamente indisponível." });

  let input;
  try {
    input = typeof request.body === "string" ? JSON.parse(request.body || "{}") : (request.body || {});
  } catch {
    return response.status(400).json({ ok: false, error: "Conteúdo inválido." });
  }
  if (input.website) return response.status(200).json({ ok: true });

  const payload = Object.fromEntries(fields.map((field) => [field, clean(input[field], field === "mensagem" ? 1200 : 250)]));
  if (!payload.nome || !payload.whatsapp || !payload.email || !payload.interesse || !payload.consentimento) {
    return response.status(400).json({ ok: false, error: "Preencha os campos obrigatórios." });
  }

  try {
    const upstream = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });
    const result = await upstream.json().catch(() => ({}));
    if (!upstream.ok || !result.ok) throw new Error(result.error || "Falha na planilha.");
    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error("candidatura_error", error);
    return response.status(502).json({ ok: false, error: "Não foi possível registrar os dados agora." });
  }
};
