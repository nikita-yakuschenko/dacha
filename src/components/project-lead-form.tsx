"use client";
import { useId, useRef, useState, type FormEvent } from "react";
import { IconArrowRight, IconCheck, IconLoader2 } from "@tabler/icons-react";
import { siteConfig, type Project } from "@/lib/data";
import { getAttribution, track } from "@/lib/analytics";
import { useSelection } from "./selection";

// Маска телефона: +7 (999) 123-45-67 из любых введённых цифр
function maskPhone(value: string) {
  let digits = value.replace(/\D/g, "");
  if (!digits) return "";
  if (digits[0] === "8") digits = `7${digits.slice(1)}`;
  if (digits[0] !== "7") digits = `7${digits}`;
  const rest = digits.slice(1, 11);
  let masked = "+7";
  if (rest.length > 0) masked += ` (${rest.slice(0, 3)}`;
  if (rest.length > 3) masked += `) ${rest.slice(3, 6)}`;
  if (rest.length > 6) masked += `-${rest.slice(6, 8)}`;
  if (rest.length > 8) masked += `-${rest.slice(8, 10)}`;
  return masked;
}

export function ProjectLeadForm({ project }: { project?: Project }) {
  const { selection } = useSelection();
  const id = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const requestId = useRef<string | null>(null);
  const live = Boolean(siteConfig.endpoint && siteConfig.policyUrl);
  const format = selection.format === "assembly" ? "assembly" : "kit";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    if (phone.replace(/\D/g, "").length !== 11) { setError("Введите номер полностью: +7 и 10 цифр"); return; }
    setError(null);
    if (!live) { setStatus("done"); return; }
    setStatus("sending");
    requestId.current ||= crypto.randomUUID();
    try {
      const response = await fetch(siteConfig.endpoint!, { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": requestId.current }, body: JSON.stringify({ name: name.trim(), channel: "phone", contact: phone, project: project?.slug ?? selection.project, format, terrace: selection.terrace, attribution: getAttribution() }), signal: AbortSignal.timeout(15000) });
      const receipt: { accepted?: boolean; id?: string } = await response.json();
      if (!response.ok || receipt.accepted !== true || !receipt.id) throw new Error("No receipt");
      track({ event: "lead_accepted", project: project?.slug ?? selection.project, format });
      setStatus("done");
    } catch {
      setError("Не получилось отправить. Проверьте соединение и нажмите ещё раз.");
      setStatus("idle");
    }
  }

  if (status === "done") return <div className="lead-done" role="status">
    <span className="lead-done-icon"><IconCheck size={26} stroke={2.2} /></span>
    <h3>Спасибо{name.trim() && `, ${name.trim()}`}!</h3>
    <p>{project ? `Перезвоним на ${phone} и рассчитаем дом «${project.name}» под ваш участок.` : `Перезвоним на ${phone}, поможем выбрать дом и посчитаем стоимость.`}</p>
  </div>;

  return <form className="lead-form" onSubmit={submit} noValidate>
    <div className="lead-field"><label htmlFor={`${id}-name`}>Имя</label><input id={`${id}-name`} value={name} onChange={e => setName(e.target.value.slice(0, 80))} autoComplete="given-name" placeholder="Ваше имя" /></div>
    <div className="lead-field"><label htmlFor={`${id}-phone`}>Телефон</label><input id={`${id}-phone`} value={phone} onChange={e => { setPhone(maskPhone(e.target.value)); setError(null); }} type="tel" inputMode="tel" autoComplete="tel" placeholder="+7 (999) 123-45-67" aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} /></div>
    {error && <p className="lead-error" id={`${id}-error`} role="alert">{error}</p>}
    <button className="lead-submit" type="submit" disabled={status === "sending"}>{status === "sending" ? <><IconLoader2 className="loading-icon" size={20} />Отправляем…</> : <>Получить расчёт<IconArrowRight size={20} /></>}</button>
    <p className="lead-legal">Нажимая кнопку, вы соглашаетесь на обработку персональных данных{siteConfig.policyUrl && <> — <a href={siteConfig.policyUrl} target="_blank" rel="noopener noreferrer">политика</a></>}.</p>
  </form>;
}
