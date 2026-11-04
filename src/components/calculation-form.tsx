"use client";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IconArrowLeft, IconArrowRight, IconCheck, IconInfoCircle, IconLoader2, IconPackage, IconTools, IconHelp } from "@tabler/icons-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useSelection, FormatSwitch } from "./selection";
import { formats, projects, siteConfig, type ProjectId } from "@/lib/data";
import { getAttribution, track } from "@/lib/analytics";
const schema = z.object({
  custom: z.string().max(300, "До 300 символов"),
  location: z.string().trim().min(2, "Укажите населённый пункт, минимум 2 символа").max(150, "До 150 символов"),
  timing: z.string(), channel: z.enum(["phone", "telegram"]), contact: z.string().trim(),
  name: z.string().max(80, "До 80 символов"), consent: z.boolean().refine(Boolean, "Отметьте согласие, чтобы проверить форму"),
}).superRefine((data, ctx) => {
  const valid = data.channel === "phone" ? /^(?:\+7|7|8)[\s(\d)-]{9,20}$/.test(data.contact) && data.contact.replace(/\D/g, "").length === 11 : /^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(data.contact);
  if (!valid) ctx.addIssue({ code: "custom", path: ["contact"], message: data.channel === "phone" ? "Введите номер из 11 цифр, начиная с +7 или 8" : "Введите Telegram: 5–32 латинских символа, цифры или _" });
});
type Fields = z.infer<typeof schema>;
export function CalculationForm({ compact = false, initialProject, initialStep = 0 }: { compact?: boolean; initialProject?: ProjectId; initialStep?: number }) {
  const { selection, update } = useSelection();
  const [step, setStep] = useState(initialStep);
  const [status, setStatus] = useState<{ kind: "demo" | "error" | "success"; text: string } | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const hasNavigated = useRef(false);
  const requestId = useRef<string | null>(null);
  const submitting = useRef(false);
  const { register, control, handleSubmit, trigger, setValue, setError, formState: { errors, isSubmitting } } = useForm<Fields>({ resolver: zodResolver(schema), mode: "onChange", defaultValues: { location: "", custom: "", timing: "Пока сравниваю", channel: "phone", contact: "", name: "", consent: false } });
  const channel = useWatch({ control, name: "channel" });
  const custom = useWatch({ control, name: "custom" });
  const location = useWatch({ control, name: "location" });
  const project = projects.find(p => p.slug === (initialProject || selection.project));
  const live = Boolean(siteConfig.endpoint && siteConfig.policyUrl);
  useEffect(() => {
    function open(event: Event) { const patch = (event as CustomEvent<{ project?: ProjectId }>).detail; setStatus(null); hasNavigated.current = true; setStep(patch.project === "custom" ? 1 : patch.project ? 2 : 0); }
    window.addEventListener("dacha:calculate", open);
    return () => window.removeEventListener("dacha:calculate", open);
  }, []);
  useEffect(() => { if (hasNavigated.current && !compact) titleRef.current?.focus(); }, [step, compact]);
  async function next() {
    setStatus(null);
    if (step === 1 && selection.project === "custom" && !custom.trim()) { setError("custom", { message: "Укажите размер или пожелание к дому" }); return; }
    if (step === 2 && !await trigger("location", { shouldFocus: true })) return;
    track({ event: "step_complete", step: step + 1, project: initialProject || selection.project, format: selection.format });
    hasNavigated.current = true; setStep(s => Math.min(3, s + 1));
  }
  async function submit(data: Fields) {
    if (submitting.current) return;
    setStatus(null);
    if (!compact && selection.project === "custom" && !data.custom.trim()) { setStep(1); setError("custom", { message: "Укажите размер или пожелание к дому" }); return; }
    if (!live) { setStatus({ kind: "demo", text: "Поля проверены. Это демонстрация: заявка не отправлена, контакт никуда не передан." }); return; }
    submitting.current = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    requestId.current ||= crypto.randomUUID();
    try {
      const response = await fetch(siteConfig.endpoint!, { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": requestId.current }, body: JSON.stringify({ ...data, project: initialProject || selection.project, format: selection.format, terrace: selection.terrace, attribution: getAttribution() }), signal: controller.signal });
      const receipt: { accepted?: boolean; id?: string } = await response.json();
      if (!response.ok || receipt.accepted !== true || !receipt.id) throw new Error("No receipt");
      setStatus({ kind: "success", text: `Заявка принята системой. Номер: ${receipt.id}. ${project?.name || "Свой размер"}, ${formats[selection.format]}, ${data.location}. Канал ответа: ${data.channel === "phone" ? "телефон" : "Telegram"}.` });
      track({ event: "lead_accepted", project: initialProject || selection.project, format: selection.format });
    } catch { setStatus({ kind: "error", text: "Не удалось подтвердить приём заявки. Данные остались в форме. Проверьте соединение и повторите отправку." }); }
    finally { clearTimeout(timeout); submitting.current = false; }
  }
  const contactFields = <>
    <fieldset className="channel-field"><legend>Куда отправить расчёт?</legend><div className="channel-options">{(["phone", "telegram"] as const).map(value => <label key={value}><input type="radio" value={value} {...register("channel")} onChange={() => { setValue("channel", value); setValue("contact", ""); setStatus(null); }} />{value === "phone" ? "Телефон" : "Telegram"}</label>)}</div></fieldset>
    <div className="field"><Label htmlFor={`contact-${compact}`}>{channel === "phone" ? "Номер телефона" : "Имя пользователя Telegram"}</Label><Input id={`contact-${compact}`} {...register("contact")} type={channel === "phone" ? "tel" : "text"} inputMode={channel === "phone" ? "tel" : "text"} autoComplete={channel === "phone" ? "tel" : "off"} placeholder={channel === "phone" ? "+7 (999) 123-45-67" : "@username"} aria-invalid={!!errors.contact} aria-describedby={errors.contact ? `contact-error-${compact}` : undefined} /><FieldError id={`contact-error-${compact}`} message={errors.contact?.message} /></div>
    <div className="field"><Label htmlFor={`name-${compact}`}>Имя <span className="muted">— необязательно</span></Label><Input id={`name-${compact}`} {...register("name")} autoComplete="given-name" aria-invalid={!!errors.name} /><FieldError message={errors.name?.message} /></div>
    <label className="check-label"><input type="checkbox" {...register("consent")} aria-invalid={!!errors.consent} aria-describedby={`consent-error-${compact}`} /><span>Согласен на обработку данных для подготовки расчёта{siteConfig.policyUrl && <>. <a className="text-link" href={siteConfig.policyUrl} target="_blank" rel="noopener noreferrer">Политика обработки данных</a></>}</span></label><FieldError id={`consent-error-${compact}`} message={errors.consent?.message} />
  </>;
  const locationFields = <><div className="field"><Label htmlFor={`location-${compact}`}>Населённый пункт</Label><Input id={`location-${compact}`} {...register("location")} autoComplete="address-level2" placeholder="Например, Арзамас" aria-invalid={!!errors.location} aria-describedby={errors.location ? `location-error-${compact}` : undefined} /><FieldError id={`location-error-${compact}`} message={errors.location?.message} /></div><div className="field"><Label htmlFor={`timing-${compact}`}>Когда планируете?</Label><select id={`timing-${compact}`} {...register("timing")}><option>Пока сравниваю</option><option>К дачному сезону</option><option>В течение 3 месяцев</option><option>Позже</option></select></div></>;
  return <div className={`calculation ${compact ? "compact-calculation" : ""}`}>
    {compact ? <><h2>Расчёт вашего дома</h2><p className="muted">{project?.name} · {project?.width} × {project?.depth} м</p><FormatSwitch /></> : <ol className="stepper" aria-label="Этапы расчёта">{["Формат", "Проект", "Куда и когда", "Контакт"].map((label, i) => <li key={label} aria-current={step === i ? "step" : undefined} data-done={i < step}><span>{i < step ? <IconCheck size={16} /> : i + 1}</span><small>{label}</small></li>)}</ol>}
    <div className="demo-note"><IconInfoCircle size={18} aria-hidden="true" /><p>{live ? "Состав и логистику уточним по вашему запросу." : "Демонстрационная форма — заявки не отправляются."}</p></div>
    <form onSubmit={event => { if (!compact && step < 3) { event.preventDefault(); void next(); } else { void handleSubmit(submit)(event); } }} noValidate>
      {compact ? <div className="fields-grid">{locationFields}{contactFields}</div> : <>
        <h3 ref={titleRef} tabIndex={-1} className="step-title">{["Как вы хотите получить дом?", "Какой размер вам подходит?", "Куда доставить и когда?", "Оставьте один контакт"][step]}</h3>
        {step === 0 && <div className="choice-grid">{(["kit", "assembly", "help"] as const).map((format, i) => { const Icon = [IconPackage, IconTools, IconHelp][i]; return <button className="choice" type="button" key={format} aria-pressed={selection.format === format} onClick={() => { update({ format }); track({ event: "format_select", format }); }}><Icon size={28} stroke={1.4} /><strong>{formats[format]}</strong><span>{["Для самостоятельной сборки", "Сборка нашей бригадой после проверки маршрута", "Сравним варианты вместе"][i]}</span><span className="choice-check">{selection.format === format && <IconCheck size={14} />}</span></button>; })}</div>}
        {step === 1 && <><div className="size-options">{projects.map(p => <button className="size-choice" type="button" key={p.slug} aria-pressed={selection.project === p.slug} onClick={() => { update({ project: p.slug }); track({ event: "project_select", project: p.slug }); }}><strong>{p.name}</strong><span>{p.width} × {p.depth} м</span></button>)}<button className="size-choice" type="button" aria-pressed={selection.project === "custom"} onClick={() => update({ project: "custom" })}><strong>Свой размер</strong><span>Есть идея или эскиз</span></button></div>{selection.project === "custom" && <div className="field"><Label htmlFor="custom">Размер или пожелание</Label><Input id="custom" {...register("custom")} placeholder="Например, 6 × 7 м с террасой" aria-invalid={!!errors.custom} /><FieldError message={errors.custom?.message} /><p className="small muted">Эскиз можно передать после первого контакта.</p></div>}<label className="check-label"><input type="checkbox" checked={selection.terrace} onChange={e => update({ terrace: e.target.checked })} /><span>Рассчитать террасу отдельно</span></label><p className="small muted">Площадь террасы не входит в наружный контур дома.</p></>}
        {step === 2 && <><div className="fields-grid">{locationFields}</div><p className="logistics-note">{selection.format === "assembly" ? "Проверим доступность монтажа: Нижегородская область и ориентировочно до 500 км от Нижнего Новгорода. Монтаж по вашему адресу пока не подтверждён." : "Проверим маршрут, доступность доставки и способ разгрузки по вашему адресу."}</p></>}
        {step === 3 && <><div className="form-summary">{project?.name || "Свой размер"}{selection.project === "custom" && `: ${custom}`} · {formats[selection.format]}{selection.terrace && " · Терраса отдельно"}{location && ` · ${location}`}<span>Стоимость уточняется</span></div><div className="fields-grid">{contactFields}</div></>}
      </>}
      {compact && <p className="small muted">Доставка и монтаж — после проверки маршрута. Стоимость уточняется.</p>}
      <div className="form-actions">{!compact && <Button type="button" variant="ghost" disabled={step === 0 || isSubmitting} onClick={() => { hasNavigated.current = true; setStep(s => s - 1); setStatus(null); }}><IconArrowLeft size={17} />Назад</Button>}{!compact && step < 3 ? <Button key="next" type="button" onClick={next}>Далее<IconArrowRight size={17} /></Button> : <Button key="submit" type="submit" disabled={isSubmitting || status?.kind === "success"}>{isSubmitting ? <><IconLoader2 className="loading-icon" size={18} />Отправляем…</> : live ? "Получить расчёт моего дома" : "Проверить форму"}<IconArrowRight size={17} /></Button>}</div>
      {status && <p className={`form-status status-${status.kind}`} role={status.kind === "error" ? "alert" : "status"}>{status.text}</p>}
      {!live && <p className="legal-note">Приём заявок будет доступен после подключения сервиса и публикации документов оператора данных. Введённые данные не сохраняются.</p>}
    </form>
  </div>;
}
function FieldError({ message, id }: { message?: string; id?: string }) { return message ? <p className="field-error" id={id} role="alert">{message}</p> : null; }


