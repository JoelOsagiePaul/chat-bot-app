import React from 'react';
import { Box, Typography, Link, Divider } from '@mui/material';

export interface ParsedElement {
  type: 'text' | 'heading' | 'list' | 'link' | 'bold' | 'italic' | 'code' | 'codeBlock' | 'divider' | 'eventInfo';
  content: string;
  level?: number;
  items?: string[];
  language?: string;
  metadata?: {
    name?: string;
    date?: string;
    location?: string;
    price?: string;
    description?: string;
    [key: string]: string | undefined;
  };
}


const preprocessEventTags = (text: string): string => {
  // Replace <i id='field'>content</i> with a more readable format
  return text
    .replace(/<i id='date'>Date:\s*([^<]+)<\/i>/gi, '📅 **Date:** $1')
    .replace(/<i id='location'>Location:\s*([^<]+)<\/i>/gi, '📍 **Location:** $1')
    .replace(/<i id='name'>([^<]+)<\/i>/gi, '🎯 **Event:** $1')
    .replace(/<i id='price'>Tickets:\s*\[Get Tickets\]\s*\(([^)]+)\)<\/i>/gi, '🎟️ **Tickets:** [Get Tickets]($1)')
    .replace(/<i id='price'>Tickets:\s*\[Get Tickets\]<\/i>/gi, '🎟️ **Tickets:** Get Tickets')
    .replace(/<i id='description'>([^<]+)<\/i>/gi, '📝 **Details:** $1')
    // Generic fallback for any other <i id='...'> tags
    .replace(/<i id='([^']+)'>([^<]+)<\/i>/gi, '**$1:** $2')
    // Clean up any remaining i tags
    .replace(/<\/?i[^>]*>/gi, '');
};

export const parseMessage = (text: string): ParsedElement[] => {
  // Preprocess the text to handle event tags
  text = preprocessEventTags(text);
  const lines = text.split('\n');
  const elements: ParsedElement[] = [];
  let currentCodeBlock: string[] = [];
  let inCodeBlock = false;
  let codeLanguage = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block detection
if (line.trim().startsWith('

    if (inCodeBlock) {
      currentCodeBlock.push(line);
      continue;
    }

    // Divider (---, ***, ___)
    if (line.trim().match(/^(---|\*\*\*|___)$/)) {
      elements.push({ type: 'divider', content: '' });
      continue;
    }

    // Headings (###, ##, #)
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      elements.push({
        type: 'heading',
        content: headingMatch[2],
        level: headingMatch[1].length,
      });
      continue;
    }

    // Unordered list (-, *, •)
    if (line.trim().match(/^[-*•]\s+(.+)$/)) {
      const listItems: string[] = [line.trim().substring(2)];
      
      // Collect consecutive list items
      while (i + 1 < lines.length && lines[i + 1].trim().match(/^[-*•]\s+(.+)$/)) {
        i++;
        listItems.push(lines[i].trim().substring(2));
      }
      
      elements.push({
        type: 'list',
        content: '',
        items: listItems,
      });
      continue;
    }

    // Numbered list (1., 2., etc.)
    if (line.trim().match(/^\d+\.\s+(.+)$/)) {
      const listItems: string[] = [line.trim().replace(/^\d+\.\s+/, '')];
      
      // Collect consecutive list items
      while (i + 1 < lines.length && lines[i + 1].trim().match(/^\d+\.\s+(.+)$/)) {
        i++;
        listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
      }
      
      elements.push({
        type: 'list',
        content: '',
        items: listItems,
      });
      continue;
    }

    // Regular text (may contain inline formatting)
    if (line.trim()) {
      elements.push({
        type: 'text',
        content: line,
      });
    }
  }

  return elements;
};


export const renderInlineFormatting = (text: string, isUser: boolean): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  // Combined regex for all inline formatting
  const inlineRegex = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)|(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
  let match;

  while ((match = inlineRegex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(<span key={`text-${key++}`}>{text.slice(lastIndex, match.index)}</span>);
    }

    if (match[1]) {
      // Bold (**text**)
      parts.push(
        <strong key={`bold-${key++}`} style={{ fontWeight: 600 }}>
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // Italic (*text*)
      parts.push(
        <em key={`italic-${key++}`} style={{ fontStyle: 'italic' }}>
          {match[4]}
        </em>
      );
    } else if (match[5]) {
      // Inline code (`code`)
      parts.push(
        <code
          key={`code-${key++}`}
          style={{
            backgroundColor: isUser ? 'rgba(0, 0, 0, 0.2)' : 'rgba(139, 92, 246, 0.1)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            fontSize: '0.9em',
          }}
        >
          {match[6]}
        </code>
      );
    } else if (match[7] || match[8]) {
      // URLs
      const url = match[8] ? `https://${match[8]}` : match[7];
      parts.push(
        <Link
          key={`link-${key++}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: isUser ? 'rgba(255, 255, 255, 0.9)' : 'secondary.main',
            textDecoration: 'underline',
            '&:hover': {
              color: isUser ? '#ffffff' : 'secondary.light',
            },
          }}
        >
          {match[7] || match[8]}
        </Link>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(<span key={`text-${key++}`}>{text.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : text;
};


export const renderMessageElement = (
  element: ParsedElement,
  index: number,
  isUser: boolean
): React.ReactNode => {
  switch (element.type) {
    case 'heading':
      const headingVariant = element.level === 1 ? 'h6' : element.level === 2 ? 'subtitle1' : 'subtitle2';
      return (
        <Typography
          key={`heading-${index}`}
          variant={headingVariant}
          sx={{
            fontWeight: 600,
            mb: 1,
            mt: index > 0 ? 2 : 0,
            color: isUser ? 'inherit' : 'secondary.main',
          }}
        >
          {renderInlineFormatting(element.content, isUser)}
        </Typography>
      );

    case 'list':
      return (
        <Box key={`list-${index}`} component="ul" sx={{ pl: 2, my: 1 }}>
          {element.items?.map((item, i) => (
            <Typography key={`item-${i}`} component="li" variant="body1" sx={{ mb: 0.5 }}>
              {renderInlineFormatting(item, isUser)}
            </Typography>
          ))}
        </Box>
      );

    case 'codeBlock':
      return (
        <Box
          key={`code-${index}`}
          sx={{
            backgroundColor: isUser ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.6)',
            borderRadius: 1,
            p: 1.5,
            my: 1,
            overflow: 'auto',
            border: '1px solid rgba(139, 92, 246, 0.2)',
          }}
        >
          {element.language && (
            <Typography
              variant="caption"
              sx={{
                color: 'secondary.main',
                fontWeight: 500,
                mb: 1,
                display: 'block',
              }}
            >
              {element.language}
            </Typography>
          )}
          <Typography
            component="pre"
            sx={{
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              fontSize: '0.875rem',
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {element.content}
          </Typography>
        </Box>
      );

    case 'divider':
      return <Divider key={`divider-${index}`} sx={{ my: 2, opacity: 0.3 }} />;

    case 'text':
    default:
      return (
        <Typography key={`text-${index}`} variant="body1" sx={{ mb: 0.5 }}>
          {renderInlineFormatting(element.content, isUser)}
        </Typography>
      );
  }
};
