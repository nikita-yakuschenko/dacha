"use client";
import Image from "next/image";
import Link from "next/link";
import { metrikaGoal } from "@/lib/metrika";
import { CalculateButton } from "./lead-dialog";
import { ScrollTo } from "./scroll-to";
export function Header() { return <header className="site-header"><div className="container header-inner"><Link prefetch={false} href="/" aria-label="Просто дача — главная" className="brand" onClick={() => metrikaGoal("logo_header")}><Image src="/brand/logo.svg" width={224} height={106} alt="просто дача" priority /></Link><span className="brand-note">Сезонные дома.<br />Собственное производство.</span><nav aria-label="Главная навигация"><ScrollTo to="projects" goal="nav_projects">Проекты</ScrollTo><ScrollTo to="specification" goal="nav_specification">Комплектация</ScrollTo><ScrollTo to="faq" goal="nav_faq">Вопросы и ответы</ScrollTo></nav><a className="site-phone header-phone" href="tel:+78312344044">+7 (831) 234-40-44</a><CalculateButton className="header-cta" goal="lead_popup_header" /></div></header>; }
export function Footer() { return <footer className="site-footer"><div className="container footer-top"><Link prefetch={false} href="/" aria-label="На главную" onClick={() => metrikaGoal("logo_footer")}><Image src="/brand/logo.svg" width={224} height={106} alt="просто дача" /></Link><p>Простые дома<br />для простых радостей</p><a className="site-phone footer-phone" href="tel:+78312344044">+7 (831) 234-40-44</a></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} просто дача</span></div></footer>; }
