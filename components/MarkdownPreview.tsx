
import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Theme } from '../types';

interface MarkdownPreviewProps {
  content: string;
  theme: Theme;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, theme }) => {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderMermaid = async () => {
        // @ts-ignore
        if (window.mermaid) {
            try {
                // @ts-ignore
                await window.mermaid.run({
                    nodes: previewRef.current?.querySelectorAll('.language-mermaid'),
                });
            } catch(e) {
                console.error("Mermaid rendering error:", e);
            }
        }
    };
    renderMermaid();
  }, [content]);

  const isDark = theme !== 'light';

  return (
    <div 
      ref={previewRef} 
      className={`prose p-8 max-w-full overflow-y-auto ${isDark ? 'prose-invert' : ''} prose-p:text-[var(--color-text-primary)] prose-headings:text-[var(--color-text-primary)] prose-strong:text-[var(--color-text-primary)] prose-a:text-[var(--color-accent)] prose-code:text-[var(--color-code-text)]`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
            code({node, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '')
              if (match && match[1] === 'mermaid') {
                return <pre className="language-mermaid"><code>{String(children)}</code></pre>
              }
              return <code className={className} {...props}>{children}</code>
            }
          }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;