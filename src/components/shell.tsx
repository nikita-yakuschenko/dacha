"use client";
import Image from "next/image";
import Link from "next/link";
import { actionGoal } from "@/lib/metrika";
import { CalculateButton } from "./lead-dialog";
import { ScrollTo } from "./scroll-to";
export function Header() { return <header className="site-header"><div className="container header-inner"><Link prefetch={false} href="/" aria-label="Просто дача — главная" className="brand" onClick={() => actionGoal("Логотип в шапке")}><Image src="/brand/logo.svg" width={158} height={48} alt="просто дача" priority /></Link><span className="brand-note">Сезонные дома.<br />Собственное производство.</span><nav aria-label="Главная навигация"><ScrollTo to="projects" goal="Перейти к разделу «Проекты»">Проекты</ScrollTo><ScrollTo to="specification" goal="Перейти к разделу «Комплектация»">Комплектация</ScrollTo><ScrollTo to="faq" goal="Перейти к разделу «Вопросы и ответы»">Вопросы и ответы</ScrollTo></nav><CalculateButton className="header-cta" action="Получить расчёт в шапке" /></div></header>; }
export function Footer() { return <footer className="site-footer"><div className="container footer-top"><Link prefetch={false} href="/" aria-label="На главную" onClick={() => actionGoal("Логотип в подвале")}><Image src="/brand/logo.svg" width={158} height={48} alt="просто дача" /></Link><p>Дома для простых радостей<br />за городом.</p></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} просто дача</span></div></footer>; }
