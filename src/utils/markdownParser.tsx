/**
 * ============================================================================
 * MARKDOWN PARSER - Utilitário para renderizar Markdown
 * ============================================================================
 * 
 * Converte texto Markdown em elementos React formatados.
 * Suporta:
 * - **negrito**
 * - _itálico_
 * - # Títulos (H1, H2, H3)
 * - Listas com marcadores (-)
 * - Listas numeradas (1.)
 * - Citações (>)
 * - Links ([texto](url))
 * 
 * ============================================================================
 */

import React from 'react';

export function parseMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let orderedListItems: string[] = [];
  let currentListType: 'ul' | 'ol' | null = null;

  const flushList = (index: number) => {
    if (currentListType === 'ul' && listItems.length > 0) {
      elements.push(
        <ul key={`ul-${index}`} className="list-disc list-inside space-y-2 my-4 ml-4">
          {listItems.map((item, i) => (
            <li key={i} className="text-gray-900 dark:text-white">
              {parseInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    } else if (currentListType === 'ol' && orderedListItems.length > 0) {
      elements.push(
        <ol key={`ol-${index}`} className="list-decimal list-inside space-y-2 my-4 ml-4">
          {orderedListItems.map((item, i) => (
            <li key={i} className="text-gray-900 dark:text-white">
              {parseInlineMarkdown(item)}
            </li>
          ))}
        </ol>
      );
      orderedListItems = [];
    }
    currentListType = null;
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // Linha vazia
    if (trimmedLine === '') {
      flushList(index);
      elements.push(<div key={`space-${index}`} className="h-4" />);
      return;
    }

    // H1
    if (trimmedLine.startsWith('# ') && !trimmedLine.startsWith('## ')) {
      flushList(index);
      const content = trimmedLine.substring(2);
      elements.push(
        <h1 key={index} className="text-gray-900 dark:text-white mt-8 mb-4 first:mt-0">
          {parseInlineMarkdown(content)}
        </h1>
      );
      return;
    }

    // H2
    if (trimmedLine.startsWith('## ') && !trimmedLine.startsWith('### ')) {
      flushList(index);
      const content = trimmedLine.substring(3);
      elements.push(
        <h2 key={index} className="text-gray-900 dark:text-white mt-6 mb-3 first:mt-0">
          {parseInlineMarkdown(content)}
        </h2>
      );
      return;
    }

    // H3
    if (trimmedLine.startsWith('### ')) {
      flushList(index);
      const content = trimmedLine.substring(4);
      elements.push(
        <h3 key={index} className="text-gray-900 dark:text-white mt-6 mb-3 first:mt-0">
          {parseInlineMarkdown(content)}
        </h3>
      );
      return;
    }

    // Lista com marcadores
    if (trimmedLine.startsWith('- ')) {
      if (currentListType !== 'ul') {
        flushList(index);
        currentListType = 'ul';
      }
      listItems.push(trimmedLine.substring(2));
      return;
    }

    // Lista numerada (1., 2., etc)
    if (/^\d+\.\s/.test(trimmedLine)) {
      if (currentListType !== 'ol') {
        flushList(index);
        currentListType = 'ol';
      }
      const content = trimmedLine.replace(/^\d+\.\s/, '');
      orderedListItems.push(content);
      return;
    }

    // Citação
    if (trimmedLine.startsWith('> ')) {
      flushList(index);
      const content = trimmedLine.substring(2);
      elements.push(
        <blockquote
          key={index}
          className="border-l-4 border-[#000aff] dark:border-[#ac2aff] pl-4 py-2 my-4 bg-gray-50 dark:bg-gray-900/50 rounded-r-lg"
        >
          <p className="text-gray-700 dark:text-gray-300 italic">
            {parseInlineMarkdown(content)}
          </p>
        </blockquote>
      );
      return;
    }

    // Imagem standalone (linha inteira é uma imagem)
    if (/^!\[.+?\]\(.+?\)$/.test(trimmedLine)) {
      flushList(index);
      const imageMatch = trimmedLine.match(/^!\[(.+?)\]\((.+?)\)$/);
      if (imageMatch) {
        elements.push(
          <div key={index} className="my-6">
            <img
              src={imageMatch[2]}
              alt={imageMatch[1]}
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
        );
      }
      return;
    }

    // Parágrafo normal
    flushList(index);
    elements.push(
      <p key={index} className="text-gray-900 dark:text-white my-3">
        {parseInlineMarkdown(trimmedLine)}
      </p>
    );
  });

  // Flush remaining list
  flushList(lines.length);

  return <div className="space-y-1">{elements}</div>;
}

function parseInlineMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  const parts: React.ReactNode[] = [];
  let currentIndex = 0;

  // Regex para encontrar padrões inline
  const patterns = [
    { regex: /\*\*(.+?)\*\*/g, type: 'bold' },
    { regex: /_(.+?)_/g, type: 'italic' },
    { regex: /!\[(.+?)\]\((.+?)\)/g, type: 'image' }, // Image: ![alt](url)
    { regex: /\[(.+?)\]\((.+?)\)/g, type: 'link' },   // Link: [text](url)
  ];

  interface Match {
    index: number;
    length: number;
    type: string;
    content: string;
    url?: string;
  }

  const matches: Match[] = [];

  // Encontra todos os matches
  patterns.forEach(({ regex, type }) => {
    const r = new RegExp(regex.source, 'g');
    let match;
    while ((match = r.exec(text)) !== null) {
      if (type === 'link' || type === 'image') {
        matches.push({
          index: match.index,
          length: match[0].length,
          type,
          content: match[1],
          url: match[2],
        });
      } else {
        matches.push({
          index: match.index,
          length: match[0].length,
          type,
          content: match[1],
        });
      }
    }
  });

  // Ordena matches por index
  matches.sort((a, b) => a.index - b.index);

  // Processa o texto
  matches.forEach((match, idx) => {
    // Adiciona texto antes do match
    if (match.index > currentIndex) {
      parts.push(text.substring(currentIndex, match.index));
    }

    // Adiciona o elemento formatado
    if (match.type === 'bold') {
      parts.push(
        <strong key={`bold-${idx}-${match.index}`} className="font-semibold">
          {match.content}
        </strong>
      );
    } else if (match.type === 'italic') {
      parts.push(
        <em key={`italic-${idx}-${match.index}`} className="italic">
          {match.content}
        </em>
      );
    } else if (match.type === 'image') {
      parts.push(
        <img
          key={`image-${idx}-${match.index}`}
          src={match.url}
          alt={match.content}
          className="max-w-full h-auto rounded-lg my-4"
        />
      );
    } else if (match.type === 'link') {
      parts.push(
        <a
          key={`link-${idx}-${match.index}`}
          href={match.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#000aff] dark:text-[#ac2aff] hover:underline"
        >
          {match.content}
        </a>
      );
    }

    currentIndex = match.index + match.length;
  });

  // Adiciona texto restante
  if (currentIndex < text.length) {
    parts.push(text.substring(currentIndex));
  }

  return parts.length > 0 ? parts : text;
}
