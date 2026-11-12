import { dachaLabels, describeLead, parseLead, type DachaLead } from "@/lib/dacha-lead";

export const dynamic = "force-dynamic";

type EnumMap = Map<string, string>;
let cachedEnums: { project: EnumMap; format: EnumMap; options: EnumMap } | null = null;

function webhook() {
  const value = process.env.BITRIX_WEBHOOK;
  return value ? (value.endsWith("/") ? value : `${value}/`) : null;
}

async function bitrix(method: string, body: unknown) {
  const base = webhook();
  if (!base) throw new Error("unconfigured");
  const response = await fetch(`${base}${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(12000),
  });
  const data = await response.json() as { result?: unknown; error?: string };
  if (!response.ok || data.error) throw new Error("crm");
  return data.result;
}

async function enums() {
  if (cachedEnums) return cachedEnums;
  const listed = await bitrix("crm.deal.userfield.list", {}) as { ID: string; FIELD_NAME: string }[];
  const wanted = new Map(listed.filter((field) => field.FIELD_NAME.startsWith("UF_CRM_DACHA_")).map((field) => [field.FIELD_NAME, field.ID]));
  async function mapOf(name: string, labels: Map<string, string>) {
    const field = await bitrix("crm.deal.userfield.get", { id: wanted.get(name) }) as { LIST?: { ID: string; VALUE: string }[] };
    const byValue = new Map((field.LIST || []).map((item) => [item.VALUE, item.ID]));
    return new Map([...labels].map(([code, label]) => [code, byValue.get(label) || ""]));
  }
  cachedEnums = { project: await mapOf("UF_CRM_DACHA_PROJECT", dachaLabels.project), format: await mapOf("UF_CRM_DACHA_FORMAT", dachaLabels.format), options: await mapOf("UF_CRM_DACHA_OPTIONS", dachaLabels.options) };
  return cachedEnums;
}

async function contactId(lead: DachaLead) {
  const found = await bitrix("crm.duplicate.findbycomm", { entity_type: "CONTACT", type: "PHONE", values: [lead.phone] }) as { CONTACT?: number[] };
  const existing = found?.CONTACT?.[0];
  if (existing) return String(existing);
  const created = await bitrix("crm.contact.add", { fields: { NAME: lead.name, OPENED: "Y", SOURCE_ID: "DACHA", PHONE: [{ VALUE: lead.phone, VALUE_TYPE: "WORK" }] } });
  return String(created);
}

async function createDeal(lead: DachaLead) {
  const described = describeLead(lead);
  const lists = await enums();
  if (!described) throw new Error("crm");
  const projectId = lists.project.get(lead.project);
  const formatId = lists.format.get(lead.format);
  const optionIds = lead.extras.map((id) => lists.options.get(id)).filter((id): id is string => Boolean(id));
  if (!projectId || !formatId || optionIds.length !== lead.extras.length) throw new Error("crm");
  const fields: Record<string, unknown> = {
    TITLE: described.title,
    CATEGORY_ID: 89,
    STAGE_ID: "C89:NEW",
    SOURCE_ID: "DACHA",
    SOURCE_DESCRIPTION: "dacha-prosto.ru",
    CONTACT_ID: await contactId(lead),
    OPENED: "Y",
    ORIGINATOR_ID: "dacha-prosto",
    ORIGIN_ID: lead.requestId,
    UF_CRM_DACHA_PROJECT: projectId,
    UF_CRM_DACHA_FORMAT: formatId,
    UF_CRM_DACHA_TERRACE: lead.terrace ? "1" : "0",
    UF_CRM_DACHA_OPTIONS: optionIds,
    UTM_SOURCE: lead.attribution.utm_source,
    UTM_MEDIUM: lead.attribution.utm_medium,
    UTM_CAMPAIGN: lead.attribution.utm_campaign,
    UTM_CONTENT: lead.attribution.utm_content,
    UTM_TERM: lead.attribution.utm_term,
  };
  if (lead.question) fields.COMMENTS = lead.question;
  if (described.area != null) fields.UF_CRM_DACHA_AREA = described.area;
  if (described.opportunity != null) {
    fields.OPPORTUNITY = described.opportunity;
    fields.CURRENCY_ID = "RUB";
  }
  return String(await bitrix("crm.deal.add", { fields }));
}

export async function POST(request: Request) {
  const parsed = parseLead(await request.json().catch(() => null), request.headers.get("idempotency-key"));
  if (!parsed.ok) return Response.json({ accepted: false }, { status: 400 });
  if (!webhook()) return Response.json({ accepted: false }, { status: 503 });
  try {
    const existing = await bitrix("crm.deal.list", { filter: { CATEGORY_ID: 89, ORIGINATOR_ID: "dacha-prosto", ORIGIN_ID: parsed.lead.requestId }, select: ["ID"] }) as { ID: string }[];
    const id = existing[0]?.ID || await createDeal(parsed.lead);
    return Response.json({ accepted: true, id });
  } catch {
    return Response.json({ accepted: false }, { status: 502 });
  }
}
