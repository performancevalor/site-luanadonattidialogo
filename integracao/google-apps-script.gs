/** @OnlyCurrentDoc */
const SHEET_NAME = "CANDIDATOS E PARCERIAS";
const HEADERS = ["Recebido em", "Nome completo", "WhatsApp", "E-mail", "CRECI", "Cidade / região", "Interesse", "Tempo de atuação", "Disponibilidade", "Mensagem", "Aceite LGPD", "Origem", "Status"];

function doGet() {
  return jsonOutput({ ok: true, service: "Luana JD - candidaturas" });
}

function doPost(event) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const payload = JSON.parse((event && event.postData && event.postData.contents) || "{}");
    if (!payload.nome || !payload.whatsapp || !payload.email || !payload.interesse || !payload.consentimento) {
      return jsonOutput({ ok: false, error: "Campos obrigatórios ausentes." });
    }

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    sheet.appendRow([
      new Date(), safe(payload.nome), safe(payload.whatsapp), safe(payload.email), safe(payload.creci),
      safe(payload.regiao), safe(payload.interesse), safe(payload.experiencia), safe(payload.disponibilidade),
      safe(payload.mensagem, 1200), "Sim", "Site Luana Donatti", "Novo"
    ]);
    return jsonOutput({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonOutput({ ok: false, error: "Não foi possível registrar a resposta." });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function safe(value, limit) {
  const normalized = String(value || "").trim().replace(/[<>]/g, "").slice(0, limit || 250);
  return /^[=+\-@]/.test(normalized) ? "'" + normalized : normalized;
}

function jsonOutput(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
