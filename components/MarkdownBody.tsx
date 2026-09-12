type MarkdownBodyProps = {
  content: string;
};

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="font-mono text-[0.85em] text-foreground">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export function MarkdownBody({ content }: MarkdownBodyProps) {
  const blocks = content.split(/\n{2,}/);

  return (
    <div className="space-y-6 text-base leading-8 text-muted">
      {blocks.map((block, index) => {
        if (block.startsWith("## ")) {
          return (
            <h2
              key={index}
              className="pt-4 text-2xl font-medium tracking-tight text-foreground"
            >
              {block.slice(3)}
            </h2>
          );
        }

        if (block.startsWith("```")) {
          const lines = block.split("\n");
          const code = lines.slice(1, -1).join("\n");
          return (
            <pre
              key={index}
              className="overflow-x-auto border border-line bg-surface/40 p-4 font-mono text-[12px] leading-6 text-foreground"
            >
              {code}
            </pre>
          );
        }

        if (block.startsWith("1. ") || block.startsWith("- ")) {
          const items = block.split("\n");
          return (
            <ol
              key={index}
              className="list-decimal space-y-2 pl-5 text-muted"
            >
              {items.map((item) => (
                <li key={item}>{renderInline(item.replace(/^\d+\.\s|^-\s/, ""))}</li>
              ))}
            </ol>
          );
        }

        return <p key={index}>{renderInline(block)}</p>;
      })}
    </div>
  );
}
