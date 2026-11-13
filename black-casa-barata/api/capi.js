/**
 * API de Conversões da Meta (CAPI) da página Black Casa Barata de Leilão (dataset 1886866205827899, conta CA02 - Paulinho dos Leilões).
 * Cópia de desafio-do-casal-2027/api/capi.js (mesmo modelo do Pequeno Construtor).
 *
 * A página manda aqui o mesmo evento que dispara no pixel (PageView, ViewContent,
 * InitiateCheckout), com o mesmo event_id: a Meta junta os dois e conta uma vez.
 * O token fica só na Vercel (META_CAPI_TOKEN); nunca no HTML nem no repositório.
 *
 * O external_id é o código do visitante da página (pd_visitante), com hash:
 * o mesmo que o pixel recebe no init.
 *
 * Teste na Meta (Gerenciador de Eventos → Testar eventos): mande
 * "test_event_code": "TEST…" no corpo, ou grave META_TEST_EVENT_CODE na Vercel.
 */
const { createHash } = require("crypto");

const PIXEL_ID = process.env.META_PIXEL_ID || "1886866205827899";
const EVENTOS = new Set(["PageView", "ViewContent", "InitiateCheckout", "AddToCart", "Lead"]);

const texto = (v, max) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined);

module.exports = async (req, res) => {
  res.setHeader("cache-control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  const token = process.env.META_CAPI_TOKEN;
  if (!token) return res.status(503).json({ ok: false, erro: "META_CAPI_TOKEN não configurado" });

  let b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch { b = null; } }
  if (!b || !EVENTOS.has(b.event_name) || !texto(b.event_id, 120)) return res.status(400).json({ ok: false });

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || undefined;
  const ua = texto(req.headers["user-agent"], 500);
  const cd = b.custom_data && typeof b.custom_data === "object" ? b.custom_data : {};
  const custom = {};
  if (Number.isFinite(Number(cd.value)) && Number(cd.value) > 0) custom.value = Math.round(Number(cd.value) * 100) / 100;
  if (cd.currency === "BRL") custom.currency = "BRL";
  for (const k of ["content_name", "content_type"]) if (texto(cd[k], 120)) custom[k] = texto(cd[k], 120);
  if (Array.isArray(cd.content_ids)) custom.content_ids = cd.content_ids.slice(0, 5).map((x) => String(x).slice(0, 40));
  if (Number.isInteger(cd.num_items)) custom.num_items = cd.num_items;

  const evento = {
    event_name: b.event_name,
    event_time: Math.floor(Date.now() / 1000),
    event_id: texto(b.event_id, 120),
    event_source_url: texto(b.event_source_url, 1000),
    action_source: "website",
    user_data: {
      client_ip_address: ip,
      client_user_agent: ua,
      fbp: texto(b.fbp, 200),
      fbc: texto(b.fbc, 600),
      // Código do visitante (o mesmo do pixel), com hash como a Meta pede.
      external_id: /^[a-z0-9-]{8,64}$/i.test(b.visitante || "") ? [createHash("sha256").update(b.visitante.trim().toLowerCase(), "utf8").digest("hex")] : undefined,
    },
    custom_data: Object.keys(custom).length ? custom : undefined,
  };
  const corpo = { data: [evento] };
  const teste = texto(b.test_event_code, 40) || process.env.META_TEST_EVENT_CODE;
  if (teste && /^TEST\w+$/.test(teste)) corpo.test_event_code = teste;

  try {
    const r = await fetch(`https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(corpo),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error("[capi]", r.status, j && j.error && j.error.message);
      return res.status(502).json({ ok: false, erro: j && j.error && j.error.message });
    }
    return res.status(200).json({ ok: true, recebidos: j.events_received, teste: Boolean(corpo.test_event_code) });
  } catch (e) {
    console.error("[capi] falha", e && e.message);
    return res.status(502).json({ ok: false });
  }
};
