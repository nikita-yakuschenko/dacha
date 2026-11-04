import { ProjectModalLoader } from "@/components/project-modal-loader";
import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { SelectionProvider } from "@/components/selection";
import { Header, Footer } from "@/components/shell";
import { siteConfig } from "@/lib/data";
export const metadata: Metadata = { ...(siteConfig.siteUrl ? { metadataBase: new URL(siteConfig.siteUrl) } : {}), title: { default: "просто дача — сезонные дома из мини-бруса", template: "%s | просто дача" }, description: "Сезонные дачные дома собственного производства. Три размера: 4×5, 4×6 и 5×6 м. Комплект с доставкой или дом с монтажом после проверки маршрута.", robots: { index: false, follow: false }, openGraph: { locale: "ru_RU", type: "website", title: "просто дача — ближе к природе", description: "Сезонные дома из мини-бруса. Собственное производство. Три понятных размера.", images: [{ url: "/images/garden-concept.webp", width: 1536, height: 1024, alt: "Концептуальная визуализация сезонного дома" }] } };
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#F5F2E9" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ru"><body><a className="skip-link" href="#main">Перейти к содержимому</a><SelectionProvider><Header />{children}<Footer /><ProjectModalLoader /></SelectionProvider></body></html>; }


