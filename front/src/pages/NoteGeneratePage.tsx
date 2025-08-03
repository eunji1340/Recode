import CodeList from '../components/code/CodeList';
<<<<<<< HEAD
<<<<<<< HEAD
import CodeEditor from '../components/code/CodeEditor';
import CodePreview from '../components/code/CodePreview';
<<<<<<< HEAD
import type { SubmissionItem } from '../types';
import { useState } from 'react';
// import { useParams } from 'react-router-dom';
import mockSubmissionApiResponse from '../data/MockSubmissionData';
import { fetchMockAiNote } from '../data/MockAiNoteData';

type Visibility = 'private' | 'public';

export default function NoteGeneratePage() {
  //   // const { problemId } = useParams<{ problemId: string }>();
  const problemId = 'TEST-12345'; // 임시 ID

  const [successCode, setSuccessCode] = useState<SubmissionItem | null>(null);
  const [failCode, setFailCode] = useState<SubmissionItem | null>(null);
  const [title, setTitle] = useState('새 노트 제목');
  const [noteContent, setNoteContent] = useState(
    '여기에 본문을 입력하세요. **굵은 글씨**와 *기울임체*를 사용할 수 있습니다.',
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [visibility, setVisibility] = useState<Visibility>('private');

  // TODO: fetch 변경 & 비동기 ��직 추가
  const successList = mockSubmissionApiResponse.data.pass.detail;
  const failList = mockSubmissionApiResponse.data.fail.detail;

  //   TODO: 중복 로직 통합
  const handleSuccessCodeChange = (submission: SubmissionItem) => {
    setSuccessCode(submission);
  };

  const handleFailCodeChange = (submission: SubmissionItem) => {
    setFailCode(submission);
  };

  const handleGenerateNote = async () => {
    setIsGenerating(true);
    try {
      const aiNote = await fetchMockAiNote();
      setTitle(aiNote.title);
      setNoteContent(aiNote.content);
    } catch (error) {
      console.error('AI 노트 생성 실패:', error);
      // TODO: 사용자에게 에러 알림
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    // TODO: 실제 저장 API 연결
    // console.log('문제 ID:', problemId);
    console.log('저장할 제목:', title);
    console.log('저장할 노트 내용:', noteContent);
    console.log('공개 범위:', visibility);
    alert('노트 제목, 내용, 공개 범위가 콘솔에 저장되었습니다.');
  };

  return (
    <div className="note-generate-page">
      <div className="header bg-primary p-4 text-white font-bold text-xl flex items-center gap-2">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.history.back();
          }}
          className="p-1 hover:bg-white/20 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
            />
          </svg>
        </a>
        문제: {problemId}
      </div>

      {/* body */}
      <div className="p-4">언어 선택</div>
      <div className="flex flex-row p-4">
        <div className="code-container basis-2/3">
          {/* 제출내역 list */}
          <div className="code-list flex">
            {/* TODO: mockData success/fail 분해 */}
            <div className="success-code basis-1/2">
              <CodeList
                list={successList}
                name="success-code-selection"
                onCodeSelect={handleSuccessCodeChange}
              ></CodeList>
            </div>
            <div className="fail-code basis-1/2">
              <CodeList
                list={failList}
                name="fail-code-selection"
                onCodeSelect={handleFailCodeChange}
              ></CodeList>
            </div>
          </div>

          {/* Code preview */}
          <div className="code-preview flex mt-4 space-x-4">
            <div className="success-code basis-1/2">
              <h2 className="font-bold mb-2">성공코드</h2>
              <div className="border rounded-lg p-2 min-h-[200px] overflow-auto bg-gray-50">
                {successCode ? (
                  <CodePreview
                    code={successCode.code}
                    language={successCode.language}
                  />
                ) : (
                  <div className="flex justify-center items-center h-full text-gray-500">
                    성공 코드를 선택하세요.
                  </div>
                )}
              </div>
            </div>
            <div className="fail-code basis-1/2">
              <h2 className="font-bold mb-2">실패코드</h2>
              <div className="border rounded-lg p-2 min-h-[200px] overflow-auto bg-gray-50">
                {failCode ? (
                  <CodePreview
                    code={failCode.code}
                    language={failCode.language}
                  />
                ) : (
                  <div className="flex justify-center items-center h-full text-gray-500">
                    실패 코드를 선택하세요.
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleGenerateNote}
            disabled={isGenerating}
            className="create-btn mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-purple-400"
          >
            {isGenerating ? 'AI 노트 생성 중...' : 'AI 노트 생성'}
          </button>
        </div>

        {/* Note Editor Section */}
        <div className="editor-container basis-1/3 flex flex-col p-4">
          <div className="flex items-center mb-4">
            <label htmlFor="note-title" className="font-bold mr-2">
              노트 제목:
            </label>
            <input
              id="note-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 p-2 border rounded-md"
            />
          </div>
          <div className="flex-1">
            <CodeEditor
              content={noteContent}
              onContentChange={setNoteContent}
            ></CodeEditor>
          </div>
          <div className="mt-4">
            <fieldset>
              <legend className="font-bold mb-2">공개 범위 설정</legend>
              <div className="flex items-center gap-4">
                <div>
                  <input
                    type="radio"
                    id="private"
                    name="visibility"
                    value="private"
                    checked={visibility === 'private'}
                    onChange={() => setVisibility('private')}
                    className="mr-1"
                  />
                  <label htmlFor="private">나만 공개</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="public"
                    name="visibility"
                    value="public"
                    checked={visibility === 'public'}
                    onChange={() => setVisibility('public')}
                    className="mr-1"
                  />
                  <label htmlFor="public">전체 공개</label>
                </div>
              </div>
            </fieldset>
          </div>
          <button
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            저장하기
          </button>
        </div>
      </div>
=======
=======
import CodeEditor from '../components/code/CodeEditor';
import CodePreview from '../components/code/CodePreview';
>>>>>>> 458739a (style(note): 코드 생성 페이지 레이아웃 초기 설정)
=======
import mockList from '../data/MockSubmitList';
import type { SubmissionItem } from '../types';
import { useState } from 'react';
>>>>>>> 1fd35ed (tmp: codeList 컴포넌트 정리)

export default function NoteGenerate() {
  const [successCode, setSuccessCode] = useState<SubmissionItem | null>(null);
  //   const [failCode, setFailCode] = useState<SubmissionItem | null>(null);

  //   TODO: mock 코드 성공 / 실패 따로 변경
  // TODO: fetch 변경 & 비동기 로직 추가
  const successCodeList: SubmissionItem[] = mockList.filter(
    (item) => item.resultText === '맞았습니다!!',
  );
  const failCodeList: SubmissionItem[] = mockList.filter(
    (item) => item.resultText !== '맞았습니다!!',
  );

  //   확장성 증가 위해 함수로 감쌈
  const handleCodeChange = (submission: SubmissionItem) => {
    setSuccessCode(submission);
  };
  return (
    <div className="note-generate-page">
      <div className="header bg-blue-700">문제이름</div>

      {/* body */}
      <div>언어 선택</div>
      <div className="container flex flex-row">
        <div className="code-container basis-2/3">
          {/* 제출내역 list */}
          <div className="code-list flex">
            {/* TODO: mockData success/fail 분해 */}
            <div className="success-code basis-1/2">
              <CodeList
                list={successCodeList}
                onCodeSelect={handleCodeChange}
              ></CodeList>
            </div>
            <div className="fail-code basis-1/2">
              <CodeList
                list={failCodeList}
                onCodeSelect={handleCodeChange}
              ></CodeList>
            </div>
          </div>

<<<<<<< HEAD
      {/* Code 기반 GPT 생성 */}
>>>>>>> 5921423 (tmp(code): 코드 생성 뷰 테스트)
=======
          {/* Code preview */}
          <div className="code-preview flex">
            <div className="success-code basis-1/2">
              <h2>성공코드</h2>
              {/* <CodePreview
                code={successCode?.code}
                language={successCode?.language}
              ></CodePreview> */}
            </div>
            <div className="fail-code basis-1/2">
              <h2>실패코드</h2>
              {/* <CodePreview
                code={failCode?.code}
                language={failCode?.language}
              ></CodePreview> */}
            </div>
          </div>
          {/* TODO: GPT 생성 API 연결 */}
          <button className="create-btn">코드 생성</button>
        </div>

        {/* Code Editor */}
        <div className="editor-container basis-1/3">
          <CodeEditor></CodeEditor>
          <div>공개 범위 설정</div>

          {/* TODO: 생성 API 연결 */}
          <button>저장하기</button>
        </div>
      </div>
>>>>>>> 458739a (style(note): 코드 생성 페이지 레이아웃 초기 설정)
    </div>
  );
}
