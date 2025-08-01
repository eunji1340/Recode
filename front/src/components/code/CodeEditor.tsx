import Markdown from 'react-markdown';
import { useState, type SetStateAction } from 'react';

export default function CodeEditor() {
  const [markdown, setMarkdown] = useState('');

  const handleInputChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setMarkdown(event.target.value);
  };

  return (
    <div>
      <textarea
        value={markdown}
        onChange={handleInputChange}
        style={{ width: '50%', height: '300px' }}
      />
      <div>
        <Markdown>{markdown}</Markdown>
      </div>
    </div>
  );
}
