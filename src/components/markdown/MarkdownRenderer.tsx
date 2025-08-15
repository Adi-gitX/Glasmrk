import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { GlassCard } from '../ui/GlassCard';
import { Quote, Copy, Check, ExternalLink } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  title?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, title }) => {
  const hasCustomStyling = (props?: Record<string, unknown>) => {
    if (!props) return false;
    if ('className' in props || 'style' in props) return true;
    if ('data' in props && typeof props.data === 'object' && props.data && 'style' in (props.data as Record<string, unknown>)) return true;
    return false;
  };

  const slugify = (text: string) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      // remove anything that's not word/space/dash
      .replace(/[^\w\s-]+/g, '')
      .replace(/--+/g, '-');

  const CodeBlock: React.FC<{ className?: string; children?: React.ReactNode }> = ({ className, children }) => {
    const [copied, setCopied] = React.useState(false);
    const codeText = React.Children.toArray(children).join('') as string;
    const copy = async () => {
      try {
        await navigator.clipboard.writeText(codeText || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* ignore */
      }
    };
    return (
      <div className="relative my-4">
        <pre className={`rounded-2xl overflow-auto bg-black/50 border border-white/6 p-4 ${className || ''}`}>
          <code className={className}>{children}</code>
        </pre>
        <button onClick={copy} aria-label="Copy code" className="absolute top-3 right-3 bg-black/30 hover:bg-black/40 text-slate-200 p-2 rounded-md">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    );
  };

  const Heading: React.FC<{ level: number; children?: React.ReactNode } & Record<string, unknown>> = ({ level, children, ...props }) => {
    if (hasCustomStyling(props)) {
      const Tag = (`h${level}`) as keyof JSX.IntrinsicElements;
      return React.createElement(Tag, props as Record<string, unknown>, children);
    }
    const text = React.Children.toArray(children).join('');
    const id = slugify(text || 'heading');
    const Tag = (`h${level}`) as keyof JSX.IntrinsicElements;
    return (
      <Tag id={id} className={`group relative scroll-mt-20 font-semibold ${level <= 2 ? 'text-white' : 'text-gray-100'}`}>
        <a href={`#${id}`} className="absolute -left-8 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
          <ExternalLink className="h-4 w-4" />
        </a>
        {children}
      </Tag>
    );
  };

  const components: Components = {
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-400 bg-blue-500/6 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <Quote className="h-5 w-5 text-blue-300 mt-1" />
          <div className="text-gray-100">{children}</div>
        </div>
      </blockquote>
    ),
    table: ({ children, ...props }) => (hasCustomStyling(props) ? <table {...props}>{children}</table> : (
      <div className="overflow-auto rounded-lg border border-white/6 my-4">
        <table className="min-w-full table-auto divide-y divide-white/6">{children}</table>
      </div>
    )),
    img: ({ src, alt, ...props }) => {
      const safeAlt = typeof alt === 'string' && alt.length > 0 ? alt : 'image';
      return hasCustomStyling(props) ? <img src={String(src)} alt={safeAlt} {...props} /> : <img src={String(src)} alt={safeAlt} className="w-full h-auto rounded-2xl shadow-2xl border border-white/10 my-4" />;
    },
    a: ({ href, children, ...props }) => {
      const isExternal = typeof href === 'string' && /^https?:\/\//.test(href);
      return hasCustomStyling(props) ? <a href={href} {...props}>{children}</a> : <a href={href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noopener noreferrer' : undefined} className="text-blue-300 hover:text-blue-200 underline">{children}</a>;
    },
    code: (props: { inline?: boolean; className?: string; children?: React.ReactNode }) => {
      const { inline, className, children } = props;
      if (inline) return <code className="bg-blue-500/10 text-blue-200 px-1 py-0.5 rounded-md">{children}</code>;
      return <CodeBlock className={className}>{children}</CodeBlock>;
    },
    li: (props) => {
      // react-markdown will pass `{ checked }` for task list items when using remark-gfm
      const maybe = props as unknown as { checked?: boolean; children?: React.ReactNode } & Record<string, unknown>;
      const { checked, children, ...rest } = maybe;
      if (typeof checked === 'boolean') {
        return (
          <li className="flex items-start gap-3">
            <input type="checkbox" checked={checked} readOnly className="mt-1" />
            <div>{children}</div>
          </li>
        );
      }
  return <li {...(rest as Record<string, unknown>)}>{children}</li>;
    },
    h1: (p) => <Heading level={1} {...p} />,
    h2: (p) => <Heading level={2} {...p} />,
    h3: (p) => <Heading level={3} {...p} />,
    h4: (p) => <Heading level={4} {...p} />,
    h5: (p) => <Heading level={5} {...p} />,
    h6: (p) => <Heading level={6} {...p} />,
  };

  return (
    <GlassCard className="p-8 max-w-5xl mx-auto">
      {title && (
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-400 mb-6">
          {title}
        </h1>
      )}
      <div className="prose prose-invert prose-xl max-w-full break-words overflow-x-auto
                      prose-headings:text-white prose-headings:font-semibold prose-headings:tracking-tight
                      prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-lg
                      prose-strong:text-white prose-strong:font-semibold
                      prose-code:text-blue-300 prose-code:bg-blue-500/10 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg
                      prose-pre:bg-black/60 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl prose-pre:p-6
                      prose-blockquote:bg-transparent prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-blue-300
                      prose-table:border-collapse prose-th:border prose-th:border-white/20 prose-th:bg-white/5 prose-th:p-4
                      prose-td:border prose-td:border-white/10 prose-td:p-4
                      prose-img:rounded-2xl prose-img:shadow-2xl prose-img:border prose-img:border-white/10
                      prose-ul:text-gray-300 prose-ol:text-gray-300 prose-li:text-gray-300
                      prose-hr:border-white/20">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
          components={components}
        >
          {content}
        </ReactMarkdown>
      </div>
    </GlassCard>
  );
};