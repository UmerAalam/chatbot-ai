import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import type { ReactNode } from "react";

const unwrapMarkdownFence = (input: string): string => {
  const trimmed = input.trim();
  const fullFence = trimmed.match(/^```(?:markdown|md)\s*\n([\s\S]*?)\n```$/i);
  if (fullFence) {
    return fullFence[1];
  }
  return input;
};

const hasMarkdownSyntax = (input: string): boolean => {
  return /(^|\n)\s*(#{1,6}\s|[-*]\s|\d+\.\s|>\s|```)|\[[^\]]+\]\([^)]+\)|`[^`]+`/.test(
    input,
  );
};

const formatPlainText = (input: string): string => {
  return input
    .trim()
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n\n");
};

const extractText = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return extractText((node as { props?: { children?: ReactNode } }).props?.children);
  }
  return "";
};

const formatLanguageLabel = (className?: string): string => {
  if (!className) return "Text";
  const token = className
    .split(/\s+/)
    .find((part) => part.startsWith("language-"))
    ?.replace("language-", "")
    .toLowerCase();

  if (!token) return "Text";
  if (token === "ts") return "TypeScript";
  if (token === "js") return "JavaScript";
  if (token === "py") return "Python";
  if (token === "sh" || token === "bash") return "Bash";

  return token.length ? token.charAt(0).toUpperCase() + token.slice(1) : "Text";
};

function MarkdownRenderer(props: { text?: string }) {
  const unwrapped = unwrapMarkdownFence(props.text || "");
  const source = hasMarkdownSyntax(unwrapped)
    ? unwrapped
    : formatPlainText(unwrapped);

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ className, children, ...rest }) {
            const language = formatLanguageLabel(className);
            const content = extractText(children).replace(/\n$/, "");
            const isBlock = content.includes("\n") || !!className;

            if (!isBlock) {
              return (
                <code className="md-inline-code" {...rest}>
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock language={language} content={content}>
                <pre className="md-code-block">
                  <code className={className} {...rest}>
                    {children}
                  </code>
                </pre>
              </CodeBlock>
            );
          },
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}

function CodeBlock(props: {
  language: string;
  content: string;
  children: React.ReactNode;
}) {
  const { language, content, children } = props;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="md-code-wrap">
      <div className="md-code-header">
        <span>{language}</span>
        <button type="button" className="md-code-copy" onClick={handleCopy}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {children}
    </div>
  );
}

export default MarkdownRenderer;
