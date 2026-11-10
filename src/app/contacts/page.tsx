import { CalculateButton } from "@/components/lead-dialog";
export const metadata = { title: "Контакты и документы" };
export default function Contacts() { return <main id="main" className="container section legal-page"><h1>Контакты<br />и документы</h1><p className="intro">Оставьте заявку на расчёт — ответим по телефону или в Telegram.</p><CalculateButton goal="lead_popup_contacts" /></main>; }
