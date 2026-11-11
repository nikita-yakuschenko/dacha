import { ProjectGrid } from "@/components/project-grid";
import { ScrollTo } from "@/components/scroll-to";
import { FaqList } from "@/components/faq-list";
import { IconArrowDown, IconLeaf, IconTools, IconWallet } from "@tabler/icons-react";
import { CalculateButton } from "@/components/lead-dialog";
import { HouseImage } from "@/components/house-image";
import { ProjectLeadForm } from "@/components/project-lead-form";
import { faq } from "@/lib/data";
import { SpecKit } from "@/components/spec-kit";
export const metadata = { alternates: { canonical: "/" } };
export default function Home() { return <main id="main">
  <section className="container hero" aria-labelledby="hero-title"><div className="hero-main"><div className="hero-copy"><h1 id="hero-title"><span className="hero-title-line">Своя дача</span><span className="hero-title-line">это просто</span></h1><p className="hero-description">Дома из мини-бруса для дачного сезона.<br />Просто выберите проект. Мы его изготовим и доставим, а если нужно, то соберём.</p><div className="hero-actions"><CalculateButton goal="lead_popup_hero" /><ScrollTo to="projects" className="text-link" goal="choose_house">Выбрать свою дачу<IconArrowDown size={18} /></ScrollTo></div><ul className="hero-facts"><li><IconLeaf aria-hidden="true" />Просто выбрать</li><li><IconWallet aria-hidden="true" />Доступно купить</li><li><IconTools aria-hidden="true" />Легко собрать</li></ul></div><HouseImage priority src="/images/hero-garden.webp" sizes="(max-width: 767px) 100vw, 1440px" className="hero-image" /></div>{/* <QuickProjects /> — временно отключено до доработки мобильной версии */}</section>
  <section id="projects" className="container section" aria-labelledby="projects-title"><div className="section-heading"><h2 id="projects-title">Просто дачи</h2></div><ProjectGrid /></section>
  <section id="specification" className="section section-tint"><div className="container"><div className="spec-intro"><h2>Простой набор</h2><CalculateButton goal="lead_popup_specification">Обсудить комплектацию</CalculateButton></div><SpecKit /></div></section>
  <section id="calculation" tabIndex={-1} className="container section calc-section"><div className="section-heading"><h2>Просто заказать</h2></div><div className="calc-layout"><HouseImage className="calc-image" /><div className="lead-panel calc-lead"><h3>Заявка на расчёт</h3><p>Перезвоним, поможем выбрать проект и посчитаем стоимость с доставкой и монтажом.</p><ProjectLeadForm goal="lead_page" /></div></div></section>
  <section className="container section process-section"><h2>Просто пять шагов</h2><ol className="process-list">{[["Выбираем", "Проект и комплектацию"], ["Согласовываем", "Условия и сроки"], ["Изготавливаем", "Ваш дачный дом"], ["Отправляем", "Комплект на участок"], ["Собираем", "Своими силами или нашей бригадой"]].map(([title, text], i) => <li key={title}><span>{i + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol></section>
  <section id="faq" className="container section faq-section"><div><h2>Просто отвечаем</h2><p className="intro">То, что важно знать до выбора дома.</p><CalculateButton goal="lead_popup_faq">Обсудить свой вопрос</CalculateButton></div><FaqList items={faq} /></section>
  <section className="container final-section"><div><h2>Есть участок?<br />Просто купи дом!</h2><CalculateButton project="custom" variant="light" goal="lead_popup_custom">Рассчитать мой вариант</CalculateButton></div><HouseImage /></section>
</main>; }