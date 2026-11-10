import { ProjectModalLoader } from "@/components/project-modal-loader";
import type { Metadata, Viewport } from "next";
import { MedeoSans } from "medeo-font/sans";
import "./globals.css";
import { SelectionProvider } from "@/components/selection";
import { Header, Footer } from "@/components/shell";
import { ScrollTo, PendingScroll } from "@/components/scroll-to";
import { siteConfig } from "@/lib/data";
import { YandexMetrika } from "@/components/yandex-metrika";
export const metadata: Metadata = { ...(siteConfig.siteUrl ? { metadataBase: new URL(siteConfig.siteUrl) } : {}), title: { default: "Просто дача\u00a0— Дома из\u00a0мини-бруса для\u00a0дачного сезона", template: "%s | просто дача" }, description: "Сезонные дачные дома собственного производства. 12 проектов от 10 до 50 м². Комплект с доставкой или дом с монтажом.", robots: { index: false, follow: false }, openGraph: { locale: "ru_RU", type: "website", title: "просто дача — ближе к природе", description: "Сезонные дома из мини-бруса. Собственное производство. 12 понятных проектов.", images: [{ url: "/images/garden-concept.webp", width: 1536, height: 1024, alt: "Сезонный дом из мини-бруса в саду" }] } };
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#FAFAFA" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ru" className={MedeoSans.variable}><body><ScrollTo to="main" className="skip-link" goal="Перейти к содержимому">Перейти к содержимому</ScrollTo><SelectionProvider><Header />{children}<Footer /><ProjectModalLoader /><PendingScroll /></SelectionProvider><YandexMetrika /></body></html>; }
