"use client";
import { useId, useRef, useState, type FormEvent } from "react";
import { IconArrowRight, IconCheck, IconLoader2 } from "@tabler/icons-react";
import { siteConfig, type Project } from "@/lib/data";
import { getAttribution, track } from "@/lib/analytics";
import { leadGoal } from "@/lib/metrika";
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

export function ProjectLeadForm({ project, formName }: { project?: Project; formName: string }) {
  const { selection } = useSelection();
  const id = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  // Ошибки по полям показываем в строке подписи, чтобы форма не меняла высоту
  const [errors, setErrors] = useState<{ name?: string; phone?: string; consent?: string }>({});
  const [sendFailed, setSendFailed] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const requestId = useRef<string | null>(null);
  const live = Boolean(siteConfig.endpoint && siteConfig.policyUrl);
  const format = selection.format === "assembly" ? "assembly" : "kit";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const found = {
      name: name.trim() ? undefined : "Укажите имя",
      phone: phone.replace(/\D/g, "").length === 11 ? undefined : "Нужно 10 цифр после +7",
      consent: consent ? undefined : "Нужно согласие",
    };
    setErrors(found);
    setSendFailed(false);
    if (found.name || found.phone || found.consent) { (found.name ? nameRef : found.phone ? phoneRef : consentRef).current?.focus(); return; }
    if (!live) { leadGoal(formName); setStatus("done"); return; }
    setStatus("sending");
    requestId.current ||= crypto.randomUUID();
    try {
      const response = await fetch(siteConfig.endpoint!, { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": requestId.current }, body: JSON.stringify({ name: name.trim(), channel: "phone", contact: phone, project: project?.slug ?? selection.project, format, terrace: selection.terrace, extras: selection.extras, attribution: getAttribution() }), signal: AbortSignal.timeout(15000) });
      const receipt: { accepted?: boolean; id?: string } = await response.json();
      if (!response.ok || receipt.accepted !== true || !receipt.id) throw new Error("No receipt");
      track({ event: "lead_accepted", project: project?.slug ?? selection.project, format });
      leadGoal(formName);
      setStatus("done");
    } catch {
      setSendFailed(true);
      setStatus("idle");
    }
  }

  if (status === "done") return <div className="lead-done" role="status">
    <span className="lead-done-icon"><IconCheck size={26} stroke={2.2} /></span>
    <h3>Спасибо{name.trim() && `, ${name.trim()}`}!</h3>
    <p>{project ? `Перезвоним на ${phone} и рассчитаем дом «${project.name}» под ваш участок.` : `Перезвоним на ${phone}, поможем выбрать дом и посчитаем стоимость.`}</p>
  </div>;

  return <form className="lead-form" onSubmit={submit} noValidate>
    <div className="lead-field" data-filled={name.length > 0} data-invalid={!!errors.name}>
      <input ref={nameRef} id={`${id}-name`} value={name} onChange={e => { setName(e.target.value.slice(0, 80)); setErrors(prev => ({ ...prev, name: undefined })); }} autoComplete="given-name" aria-invalid={!!errors.name} aria-describedby={errors.name ? `${id}-name-error` : undefined} />
      <label htmlFor={`${id}-name`}>Имя</label>
      {errors.name && <span className="lead-error" id={`${id}-name-error`} role="alert">{errors.name}</span>}
    </div>
    <div className="lead-field" data-filled={phone.length > 0} data-invalid={!!errors.phone}>
      <input ref={phoneRef} id={`${id}-phone`} value={phone} onChange={e => { setPhone(maskPhone(e.target.value)); setErrors(prev => ({ ...prev, phone: undefined })); }} type="tel" inputMode="tel" autoComplete="tel" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? `${id}-phone-error` : undefined} />
      <label htmlFor={`${id}-phone`}>Телефон</label>
      {errors.phone && <span className="lead-error" id={`${id}-phone-error`} role="alert">{errors.phone}</span>}
    </div>
    <button className="lead-submit" type="submit" disabled={status === "sending"}>{status === "sending" ? <><IconLoader2 className="loading-icon" size={20} />Отправляем…</> : sendFailed ? <span role="alert">Не отправилось, ещё раз</span> : <>Получить расчёт<IconArrowRight size={20} /></>}</button>
    <label className="lead-consent" data-invalid={!!errors.consent}>
      <input ref={consentRef} type="checkbox" checked={consent} onChange={e => { setConsent(e.target.checked); setErrors(prev => ({ ...prev, consent: undefined })); }} aria-invalid={!!errors.consent} />
      <span>Соглашаюсь на обработку персональных данных{siteConfig.policyUrl && <> — <a href={siteConfig.policyUrl} target="_blank" rel="noopener noreferrer">политика</a></>}</span>
    </label>
  </form>;
}
