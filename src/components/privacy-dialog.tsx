"use client";
import { useState, type ReactNode } from "react";
import { Dialog } from "radix-ui";
import { IconX } from "@tabler/icons-react";
import { privacyMarkdown } from "@/content/privacy";

// Ссылка из согласия открывает политику с основного сайта, не уводя с формы
export function PrivacyLink({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Trigger asChild>
      <button type="button" className="privacy-link" onClick={event => event.stopPropagation()}>{children}</button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="privacy-overlay" />
      <Dialog.Content className="privacy-dialog" aria-describedby={undefined}>
        <Dialog.Close className="privacy-close" aria-label="Закрыть"><IconX size={20} /></Dialog.Close>
        <div className="privacy-body"><PrivacyBody /></div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}

function inline(text: string, key: string) {
  const parts: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*(.+?)\*\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let index = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[1] && match[2]) {
      const href = match[2].startsWith("/") ? `https://avgst.ru${match[2]}` : match[2];
      parts.push(<a key={`${key}-a${index++}`} href={href} target="_blank" rel="noopener noreferrer">{match[1]}</a>);
    } else if (match[3]) parts.push(<strong key={`${key}-b${index++}`}>{match[3]}</strong>);
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function cells(line: string) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(cell => cell.trim());
}

function PrivacyBody() {
  const lines = privacyMarkdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) { index += 1; continue; }
    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (index < lines.length && lines[index].startsWith("|")) {
        if (!/^\|?\s*:?-{3,}/.test(lines[index])) rows.push(cells(lines[index]));
        index += 1;
      }
      const [head, ...body] = rows;
      blocks.push(<div key={`t${index}`} className="privacy-table"><table><thead><tr>{head?.map((cell, cellIndex) => <th key={cellIndex}>{inline(cell, `th${index}-${cellIndex}`)}</th>)}</tr></thead><tbody>{body.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{inline(cell, `td${index}-${rowIndex}-${cellIndex}`)}</td>)}</tr>)}</tbody></table></div>);
      continue;
    }
    if (line.startsWith("### ")) { blocks.push(<h3 key={index}>{inline(line.slice(4), `h3${index}`)}</h3>); index += 1; continue; }
    if (line.startsWith("## ")) { blocks.push(<h2 key={index}>{inline(line.slice(3), `h2${index}`)}</h2>); index += 1; continue; }
    if (line.startsWith("# ")) { blocks.push(<Dialog.Title key={index} asChild><h2 className="privacy-title">{inline(line.slice(2), `h1${index}`)}</h2></Dialog.Title>); index += 1; continue; }
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (index < lines.length && lines[index].startsWith("- ")) { items.push(lines[index].slice(2)); index += 1; }
      blocks.push(<ul key={`u${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{inline(item, `li${index}-${itemIndex}`)}</li>)}</ul>);
      continue;
    }
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\. /.test(lines[index])) { items.push(lines[index].replace(/^\d+\. /, "")); index += 1; }
      blocks.push(<ol key={`o${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{inline(item, `ol${index}-${itemIndex}`)}</li>)}</ol>);
      continue;
    }
    const paragraph: string[] = [];
    const breaks: boolean[] = [];
    while (index < lines.length && lines[index].trim() && !/^(?:#{1,3} |- |\d+\. |\|)/.test(lines[index])) {
      breaks.push(lines[index].endsWith("  "));
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push(<p key={`p${index}`}>{paragraph.map((part, partIndex) => <span key={partIndex}>{inline(part, `p${index}-${partIndex}`)}{breaks[partIndex] && partIndex < paragraph.length - 1 ? <br /> : partIndex < paragraph.length - 1 ? " " : null}</span>)}</p>);
  }
  return <>{blocks}</>;
}
