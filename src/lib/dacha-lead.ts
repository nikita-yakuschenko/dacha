import { extrasTotal, priceFor, projects } from "./data";

const extraIds = new Set(["paint"]);

export const dachaLabels = {
  project: new Map<string, string>([...projects.map((project) => [project.slug, project.name.replaceAll("\u00a0", " ")] as const), ["custom", "Свой вариант"]]),
  format: new Map<string, string>([["kit", "Комплект"], ["assembly", "Со сборкой"]]),
  options: new Map<string, string>([["paint", "Заводская покраска стен"]]),
};
const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export type DachaLead = {
  name: string;
  phone: string;
  project: string;
  format: "kit" | "assembly";
  terrace: boolean;
  extras: string[];
  attribution: Partial<Record<(typeof utmKeys)[number], string>>;
  question?: string;
  requestId: string;
};

// Сумму и площадь считает сервер по каталогу, клиент их не присылает
export function describeLead(lead: DachaLead) {
  if (lead.project === "custom") return { title: lead.question ? `Вопрос — ${lead.name}` : `Свой вариант — ${lead.name}`, area: null as number | null, opportunity: null as number | null };
  const project = projects.find((item) => item.slug === lead.project);
  if (!project) return null;
  const opportunity = priceFor(project, lead.format, lead.terrace) + extrasTotal(project, lead.extras);
  return { title: `${project.name.replace("\u00a0", " ")} — ${lead.name}`, area: project.area, opportunity };
}

export function parseLead(body: unknown, requestId: string | null): { ok: true; lead: DachaLead } | { ok: false } {
  if (!requestId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) return { ok: false };
  if (!body || typeof body !== "object") return { ok: false };
  const input = body as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim().replace(/\s+/g, " ") : "";
  const digits = typeof input.contact === "string" ? input.contact.replace(/\D/g, "") : "";
  const phoneDigits = digits.length === 11 && digits[0] === "8" ? `7${digits.slice(1)}` : digits;
  const project = typeof input.project === "string" ? input.project : "";
  const knownProject = project === "custom" || projects.some((item) => item.slug === project);
  const extras = Array.isArray(input.extras) ? input.extras.filter((item): item is string => typeof item === "string") : null;
  const attribution = input.attribution;
  let question: string | undefined;
  if (Object.prototype.hasOwnProperty.call(input, "question")) {
    question = typeof input.question === "string" ? input.question.trim().replace(/\s+/g, " ") : "";
    if (!question || question.length > 400 || /[\u0000-\u001f]/.test(question)) return { ok: false };
  }
  if (!name || name.length > 80 || /[\u0000-\u001f]/.test(name)) return { ok: false };
  if (!/^7\d{10}$/.test(phoneDigits)) return { ok: false };
  if (input.channel !== "phone" || (input.format !== "kit" && input.format !== "assembly") || typeof input.terrace !== "boolean") return { ok: false };
  if (!knownProject || !extras || new Set(extras).size !== extras.length || extras.some((item) => !extraIds.has(item))) return { ok: false };
  if (!attribution || typeof attribution !== "object" || Array.isArray(attribution)) return { ok: false };
  const utm: DachaLead["attribution"] = {};
  for (const [key, value] of Object.entries(attribution)) {
    if (!utmKeys.includes(key as (typeof utmKeys)[number]) || typeof value !== "string" || value.length > 200) return { ok: false };
    if (value) utm[key as (typeof utmKeys)[number]] = value;
  }
  return { ok: true, lead: { name, phone: `+${phoneDigits}`, project, format: input.format, terrace: input.terrace, extras, attribution: utm, question, requestId } };
}
