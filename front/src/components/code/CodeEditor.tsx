import Markdown from 'react-markdown';
import { useState } from 'react';
import remarkGfm from 'remark-gfm';

interface CodeEditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

export default function CodeEditor({
  content,
  onContentChange,
}: CodeEditorProps) {
  const [isEditing, setIsEditing] = useState(false); // 기본은 미리보기 모드

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    onContentChange(event.target.value);
  };

  if (isEditing) {
    // 편집 모드
    return (
      <div className="flex flex-col h-full">
        <textarea
          value={content}
          onChange={handleContentChange}
          className="flex-1 w-full p-2 border rounded-md"
          aria-label="Markdown Editor"
          placeholder="노트 내용을 입력하세요..."
        />
        <div className="flex-1 w-full p-4 mt-2 overflow-y-auto border rounded-md prose">
          <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
        </div>
        <button
          onClick={() => setIsEditing(false)}
          className="mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          완료
        </button>
      </div>
    );
  }

  // 미리보기 모드
  return (
    <div className="h-full">
      <div className="w-full p-4 overflow-y-auto border rounded-md prose">
        <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        수정
      </button>
    </div>
  );
}
