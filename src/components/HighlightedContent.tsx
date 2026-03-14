import React, { useMemo } from 'react';
import { Highlight } from '../types';

interface HighlightedContentProps {
  content: string;
  highlights: Highlight[];
  contentRef: React.RefObject<HTMLDivElement>;
}

export const HighlightedContent: React.FC<HighlightedContentProps> = ({ content, highlights, contentRef }) => {
  const renderedContent = useMemo(() => {
    if (!content) return null;

    // Create a temporary container to parse HTML
    const container = document.createElement('div');
    container.innerHTML = content;

    // Sort highlights by startOffset to process them in order
    const sortedHighlights = [...highlights]
      .filter(h => h.startOffset !== undefined && h.endOffset !== undefined)
      .sort((a, b) => (a.startOffset || 0) - (b.startOffset || 0));

    let currentGlobalOffset = 0;

    const processNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || '';
        const nodeStart = currentGlobalOffset;
        const nodeEnd = nodeStart + text.length;
        
        // Find highlights that overlap with this text node
        const nodeHighlights = sortedHighlights.filter(h => {
          const hStart = h.startOffset || 0;
          const hEnd = h.endOffset || 0;
          return hStart < nodeEnd && hEnd > nodeStart;
        });

        if (nodeHighlights.length > 0) {
          const fragments: (string | React.ReactNode)[] = [];
          let lastIndex = 0;

          // Process each highlight that overlaps this node
          nodeHighlights.forEach(h => {
            const hStartInNode = Math.max(0, (h.startOffset || 0) - nodeStart);
            const hEndInNode = Math.min(text.length, (h.endOffset || 0) - nodeStart);

            if (hStartInNode > lastIndex) {
              fragments.push(text.substring(lastIndex, hStartInNode));
            }

            fragments.push(
              <mark
                key={`${h.id}-${nodeStart}-${hStartInNode}`}
                className="custom-highlight"
                style={{ 
                  backgroundColor: h.color,
                  borderRadius: '4px',
                  padding: '2px 0',
                  boxShadow: `0 0 0 2px ${h.color}`,
                  cursor: 'pointer'
                }}
              >
                {text.substring(hStartInNode, hEndInNode)}
              </mark>
            );
            lastIndex = hEndInNode;
          });

          if (lastIndex < text.length) {
            fragments.push(text.substring(lastIndex));
          }

          currentGlobalOffset = nodeEnd;
          return <React.Fragment key={`text-${nodeStart}`}>{fragments}</React.Fragment>;
        }

        currentGlobalOffset = nodeEnd;
        return text;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const children = Array.from(element.childNodes).map((child, i) => (
          <React.Fragment key={i}>{processNode(child)}</React.Fragment>
        ));

        const Tag = element.tagName.toLowerCase() as any;
        // Strip attributes if needed, but we probably want to keep them (classes, etc)
        const props: any = {};
        Array.from(element.attributes).forEach(attr => {
          props[attr.name === 'class' ? 'className' : attr.name] = attr.value;
        });

        return <Tag {...props}>{children}</Tag>;
      }
      return null;
    };

    return Array.from(container.childNodes).map((node, i) => (
      <React.Fragment key={i}>{processNode(node)}</React.Fragment>
    ));
  }, [content, highlights]);

  return (
    <div 
      ref={contentRef}
      className="reader-content block"
      style={{ '--p-spacing': '1.8em' } as React.CSSProperties}
    >
      {renderedContent}
    </div>
  );
};
