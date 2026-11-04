import Image from "next/image";
import Link from "next/link";
import { CalculateButton } from "./lead-dialog";
import { ScrollTo } from "./scroll-to";
export function Header() { return <header className="site-header"><div className="container header-inner"><Link prefetch={false} href="/" aria-label="Просто дача — главная" className="brand"><Image src="/brand/logo.svg" width={158} height={48} alt="просто дача" priority /></Link><span className="brand-note">Сезонные дома.<br />Собственное производство.</span><nav aria-label="Главная навигация"><ScrollTo to="projects">Проекты</ScrollTo><ScrollTo to="specification">Комплектация</ScrollTo><ScrollTo to="faq">Вопросы и ответы</ScrollTo></nav><CalculateButton className="header-cta" /></div></header>; }
export function Footer() { return <footer className="site-footer"><div className="container footer-top"><Link prefetch={false} href="/" aria-label="На главную"><Image src="/brand/logo.svg" width={158} height={48} alt="просто дача" /></Link><p>Дома для простых радостей<br />за городом.</p></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} просто дача</span></div></footer>; }
