import { CodeBlock, dracula } from 'react-code-blocks';

interface MyCoolCodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  startingLineNumber?: number;
}

export default function CodePreview({
  code,
  language,
  showLineNumbers,
  startingLineNumber,
}: MyCoolCodeBlockProps) {
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
