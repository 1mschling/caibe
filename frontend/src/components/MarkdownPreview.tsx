import React from 'react';

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactElement[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeBlockLanguage = '';
    let listItems: string[] = [];
    let inList = false;

    lines.forEach((line, index) => {
      // Code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${index}`} className="my-4 rounded-lg bg-muted p-4 overflow-x-auto">
              <code className="text-sm">{codeBlockContent.join('\n')}</code>
            </pre>
          );
          codeBlockContent = [];
          codeBlockLanguage = '';
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
          codeBlockLanguage = line.substring(3).trim();
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Flush list if we're leaving it
      if (inList && !line.startsWith('- ') && !line.startsWith('  ') && line.trim() !== '') {
        elements.push(
          <ul key={`list-${index}`} className="my-4 ml-6 list-disc space-y-2">
            {listItems.map((item, i) => (
              <li key={i} className="text-foreground" dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }

      // Headers
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="mb-4 mt-8 text-4xl font-bold tracking-tight">
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="mb-3 mt-6 text-3xl font-semibold tracking-tight">
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="mb-2 mt-4 text-2xl font-semibold tracking-tight">
            {line.substring(4)}
          </h3>
        );
      } else if (line.startsWith('#### ')) {
        elements.push(
          <h4 key={index} className="mb-2 mt-3 text-xl font-semibold">
            {line.substring(5)}
          </h4>
        );
      } else if (line.startsWith('- ')) {
        inList = true;
        const processedLine = line.substring(2)
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`(.*?)`/g, '<code class="rounded bg-muted px-1.5 py-0.5 text-sm">$1</code>');
        listItems.push(processedLine);
      } else if (line.trim() === '') {
        if (inList) {
          elements.push(
            <ul key={`list-${index}`} className="my-4 ml-6 list-disc space-y-2">
              {listItems.map((item, i) => (
                <li key={i} className="text-foreground" dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          );
          listItems = [];
          inList = false;
        }
        elements.push(<div key={index} className="h-4" />);
      } else if (line.startsWith('![')) {
        // Image
        const match = line.match(/!\[(.*?)\]\((.*?)\)/);
        if (match) {
          const [, alt, src] = match;
          elements.push(
            <img
              key={index}
              src={src}
              alt={alt}
              className="my-4 rounded-lg border border-border max-w-full"
            />
          );
        }
      } else {
        // Regular paragraph
        const processedLine = line
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`(.*?)`/g, '<code class="rounded bg-muted px-1.5 py-0.5 text-sm">$1</code>');
        
        elements.push(
          <p
            key={index}
            className="mb-4 leading-7 text-foreground"
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        );
      }
    });

    // Flush remaining list
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key="list-final" className="my-4 ml-6 list-disc space-y-2">
          {listItems.map((item, i) => (
            <li key={i} className="text-foreground" dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      );
    }

    return elements;
  };

  return <div className="prose prose-neutral dark:prose-invert max-w-none">{renderMarkdown(content)}</div>;
}
