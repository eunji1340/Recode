import { CodeBlock, dracula } from 'react-code-blocks';

interface CodeBlockProps {
  code: string | undefined;
  language: string | undefined;
  showLineNumbers?: boolean;
  startingLineNumber?: number;
}

export default function CodePreview({
  code,
  language,
  showLineNumbers,
  startingLineNumber,
}: CodeBlockProps) {
  return (
    <CodeBlock
      text={code}
      language={language}
      showLineNumbers={showLineNumbers}
      startingLineNumber={startingLineNumber}
      theme={dracula}
    />
  );
}
