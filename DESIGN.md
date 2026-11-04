---
name: просто дача
description: Спокойная система выбора сезонного садового дома.
colors:
  primary: "#2d4938"
  background: "#f5f2e9"
  foreground: "#202820"
  surface: "#fffdf8"
  secondary: "#e8ecdf"
  muted: "#e9e9df"
  muted-foreground: "#5e665b"
  border: "#dce2d9"
  destructive: "#9c3029"
  selected: "#ecf0e4"
  switch-track: "#e7e9df"
  switch-text: "#43523f"
  field-border: "#cdd6c2"
  field-invalid: "#a33b31"
  field-error: "#9b332b"
  card-border: "#e0e3d7"
typography:
  display:
    fontFamily: '"Inter Variable", Inter, sans-serif'
    fontSize: "clamp(40px, 4.8vw, 70px)"
    fontWeight: 550
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  headline:
    fontFamily: '"Inter Variable", Inter, sans-serif'
    fontSize: "clamp(30px, 3.2vw, 46px)"
    fontWeight: 550
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  title:
    fontFamily: '"Inter Variable", Inter, sans-serif'
    fontSize: "23px"
    fontWeight: 550
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  body:
    fontFamily: '"Inter Variable", Inter, sans-serif'
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: '"Inter Variable", Inter, sans-serif'
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.55
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  button: "7px"
  panel: "14px"
  choice: "9px"
  switch-option: "5px"
spacing:
  switch-inset: "4px"
  field-gap: "8px"
  button-inline: "20px"
  card-inline: "22px"
  panel-inset: "30px"
  section-desktop: "95px"
  section-tablet: "70px"
  section-mobile: "56px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.button}"
    padding: "8px 20px"
  button-light:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    rounded: "{rounded.button}"
    padding: "8px 20px"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.button}"
    padding: "8px 20px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.button}"
    padding: "8px 20px"
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.sm}"
    height: "46px"
    padding: "0 12px"
  project-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.panel}"
  format-option-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.switch-option}"
    padding: "8px 12px"
---

# Design System: просто дача

## Overview

**Creative North Star: "Спокойный садовый каталог"**

Это описание уже реализованной системы: тёплая светлая основа, лесной акцент, открытые интервалы и чёткие границы карточек. Нейтральная типографика помогает сравнивать размеры; визуализации сада дают атмосферу, сохраняя видимую подпись о концептуальном характере.

Название «просто дача», закреплённая палитра, Inter и утверждённый SVG в контурах — обязательные ограничения из PRODUCT.md. Источники значений: src/app/globals.css, src/components/ui/button.tsx, src/components/ui/tabs.tsx, src/components/shell.tsx и src/app/layout.tsx. Токены frontmatter нормативны; адаптивные исключения описаны ниже.

**Key Characteristics:**

- Тёплые светлые поверхности и лесной акцент.
- Inter с умеренно плотными заголовками.
- Тонкие границы, мягкие углы, минимум глубины.
- Явные состояния выбора и доступное управление.

## Colors

### Primary

Лесной primary обозначает основные действия, выбранный формат, выполненные шаги и фокус. В крупных цветных секциях он становится фоном со светлым текстом.

### Neutral

Тёплый background образует страницу; surface выделяет карточки и форму. Foreground служит основным текстом, muted-foreground — пояснениями; border — разделителями. Secondary и muted поддерживают нейтральные состояния. Selected применяется к выбранным карточкам вариантов, switch-track — к общему контейнеру переключателя. Отдельные field-invalid и field-error обозначают ошибки границы и текста; destructive сохранён из темы компонентов.

## Typography

Одна семья для всех ролей: локально поставляемая Inter Variable, пакет @fontsource-variable/inter закреплён на версии 5.3.0. Не заменять её внешним CDN или декоративным шрифтом. Заголовки используют сбалансированный перенос, абзацы — pretty wrap.

Display, headline и title следуют frontmatter; фактические заголовки карточек крупнее title (26px). Основной текст уменьшается на мобильном до 14px; ввод в полях увеличивается до 16px. Поясняющий текст использует 13px/1.6, вводный — 17px/1.65 с ограничением 53ch. Это не математическая типографическая шкала: отдельные роли заданы явно.

## Layout

Актуальный hero после правок пользователя: единая композиция с изображением в правых75% и текстом слева. Светлое поле сплошное до38%, переход заканчивается на48% (на42% до1350px), до первого края дома. Текст занимает40%, максимум480px; все его элементы должны оставаться в светлом поле. Фото привязано к правому краю: крыша, фасад, крыльцо и ступени видимы целиком. Desktop padding60px44px, min-height700px. Ниже1024px текст и изображение располагаются друг под другом. На mobile внутренних боковых padding у текста нет; внешние поля задаёт container, вертикальный переход заканчивается до крыши. Эти значения имеют приоритет над исходным описанием двухколоночного hero ниже.

Контейнер ограничен 1440px, его исходная ширина — calc(100% - 112px). При ширине до 1200px вычитается 64px, до 767px — 40px, до 359px — 32px. Вертикальные интервалы секций следуют section-desktop/tablet/mobile; tablet включается до 900px, mobile — до 767px.

Основная двухколоночная композиция использует отношение 0.9fr/1.1fr и промежуток 32px. Каталог — три равных столбца с промежутком 22px (16px до 1200px). До 900px каталог становится одним столбцом с горизонтальной карточкой; до 767px карточка снова вертикальная. Проект имеет три столбца 1.05fr/1fr/0.82fr, до 1200px — два с формой на всю ширину, до 767px — вертикальный поток. Поля формы имеют два столбца, на мобильном — один. Варианты размера переходят с четырёх столбцов на два.

Главный заголовок на hero: до 1200px — 54px, до 900px — 45px, до 767px — clamp(39px, 9.3vw, 59px), до 359px — 38px. На мобильном h2 — 33px. Высота шапки: 96px, до 1200px — 84px, до 767px — 76px. Навигация шапки скрывается до 767px. При min-width 1600px минимальная высота hero и изображения — 650px вместо 570px исходной композиции.

Мобильная панель расчёта проекта закрепляется sticky у нижнего края. Её нижний отступ max(12px, env(safe-area-inset-bottom)); нижний отступ подвала max(20px, env(safe-area-inset-bottom)). Начальный scroll-padding-top — 105px, на мобильном — 25px. Проверять ширины от 320 до 1920px.

## Elevation & Depth

Глубина в основном передаётся сменой тона и границами. Глобальное оформление кнопок снимает тени. Выбранные карточки получают inset 0 0 0 1px var(--primary); это усиление контура, а не подъём. Активная вкладка сохраняет стандартный shadow-sm из локального shadcn-компонента. Не вводить произвольную систему декоративных теней.

## Shapes

Тема предоставляет sm/md/lg/xl; реальные поверхности используют также panel, choice и button. Карточки и фотографии обрезаются по закруглённому контуру. Основные границы толщиной 1px; схема наружного контура — 2px. Круги служат номерным шагам и индикаторам выбора. Логотип показывается исходным public/brand/logo.svg с сохранёнными пропорциями: ширина в шапке 148px, до 900px — 125px; в мобильном подвале — 120px. Не перерисовывать SVG текстом или шрифтом.

## Components

### Buttons

Спокойные плотные действия: 13px, weight 500, минимум 48px высоты, горизонтальные отступы button-inline, промежуток 14px. В компактных областях и на мобильном используются минимум 44px и меньшие подписи. Primary — лесной со светлым текстом; light и outline — светлые; ghost — прозрачный. Outline имеет границу. Hover из локального компонента: primary/90, secondary для light, accent для outline/ghost. Disabled отключает pointer events и снижает opacity до 0.5.

Глобальный focus-visible — контур 2px primary с отступом 4px; локальные кнопки и вкладки дополнительно используют кольцо 3px primary/50. При нажатии кнопка сдвигается вниз на 1px. Переходы цвета, фона и границы — 150ms ease-out. Hover навигации, размерных ссылок и вариантов применяется только при hover:hover и pointer:fine.

### Chips / Format switch

Переключатель формата имеет track, внутренний отступ 4px и промежуток 2px; опции — минимум 44px высоты, 12px текста. aria-pressed=true меняет фон и текст на primary/surface. Выбор виден сразу и сохраняется между страницами. До 900px переключатель hero вертикальный, до 767px снова горизонтальный с 10px текстом. Небольшие информационные теги имеют углы 4px и тонкую границу в тёмной секции.

### Cards / Containers

Карточка проекта использует surface, card-border, panel и обрезку содержимого; тело имеет отступы 23px 22px. На планшете — 25px, на мобильном — 22px, до 359px — 19px 16px. Форма — та же светлая поверхность с отступом 30px и границей #dde3d4; на мобильном — 21px 17px. Карточка выбора имеет choice, границу #d6ddcb и отступы 23px 17px. Выбор усиливает границу primary и меняет фон на selected.

### Inputs / Fields

Поля используют frontmatter field, границу field-border и подписи label. Ошибочное поле получает aria-invalid=true и field-invalid, сообщение — field-error. Placeholder — #6c7363. У флажков и radio accent-color primary, размер 18px. Подписи флажков и каналов обеспечивают минимум 44px высоты действия. Результат проверки формы показывается отдельным статусным блоком; ошибка имеет фон #f5e9e1 и текст #8e332b. Демоформа явно сообщает об отсутствии отправки.

### Navigation / Tabs / FAQ

Навигация — обычные текстовые ссылки 13px с минимальной высотой 44px; точный hover — #69805a. Подвал сохраняет доступную навигацию на мобильном. Вкладки проекта используют фон #e7ebdc, внутренний отступ 4px, углы 6px и триггеры минимум 44px; активная вкладка — background с foreground. FAQ использует native details/summary с разделителями, минимум 64px строки и поворотом плюса на 45° при раскрытии.

### Motion and accessibility

Страница не использует постоянное плавное прокручивание: html scroll-behavior:auto. Анимация загрузки — вращение 1s linear. При prefers-reduced-motion:reduce анимации и переходы сокращаются до 0.01ms, итерации до одной, нажатие перестаёт смещать кнопки. Сохранять skip link, клавиатурный фокус, подписи, aria-pressed и aria-current.

Форма главной загружается при приближении к видимой области (400px) или намерении расчёта через CTA. Её контейнер и placeholder сохраняют min-height 435px; placeholder использует оформление calculation и вертикальный промежуток 16px. Компактная форма проекта доступна сразу. Сохранять эти размеры, чтобы отложенная загрузка не нарушала визуальную непрерывность.

## Do's and Don'ts

### Do:

- **Do** сохранять закреплённую Inter, исходный SVG и палитру.
- **Do** сохранять видимые состояния выбора, ошибки и клавиатурного фокуса.
- **Do** учитывать safe area и reduced motion.
- **Do** подписывать концептуальные изображения и сохранять их provenance.

### Don't:

- **Don't** заменять логотип набранным текстом или менять его пропорции.
- **Don't** добавлять декоративные шрифты, произвольные акценты и тяжёлые тени.
- **Don't** представлять визуализацию как подтверждённую фотографию или план.
- **Don't** превращать демонстрационную проверку формы в обещание отправленной заявки.
