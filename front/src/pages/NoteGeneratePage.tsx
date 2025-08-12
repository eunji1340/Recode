import CodeList from '../components/code/CodeList';
import CodeEditor from '../components/code/CodeEditor';
import CodePreview from '../components/code/CodePreview';
import type { SubmissionItem } from '../types';
import { useState } from 'react';
import mockSubmissionApiResponse from '../data/MockSubmissionData';
import api from '../api/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import ProblemTitle from '../components/feed/ProblemTitle';
import { useLocation } from 'react-router-dom';
import type {
  AIGenerateRequestDTO,
  noteGenerateRequestDTO,
} from '../types/note';
import { useUserStore } from '../stores/userStore';
import ProtectedOverlay from '../components/common/ProtectedOverlay';

export default function NoteGeneratePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { problemName, problemTier } = location.state || {};

  const problemId = parseInt(id ?? '0', 10);

  const [successCode, setSuccessCode] = useState<SubmissionItem | null>(null);
  const [failCode, setFailCode] = useState<SubmissionItem | null>(null);
  const [title, setTitle] = useState('새 노트 제목');
  const [noteContent, setNoteContent] = useState(
    '여기에 본문을 입력하세요. **굵은 글씨**와 *기울임체*를 사용할 수 있습니다.',
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [visibility, setVisibility] = useState(true);

  //   로그인 여부 확인
  const isLoggedIn = useUserStore((state) => state.isAuthenticated);
  if (!isLoggedIn) {
    return <ProtectedOverlay />;
  }

  // TODO: 문제 가져오기는 추후에 대체
  const successList = mockSubmissionApiResponse.data.pass.detail;
  const failList = mockSubmissionApiResponse.data.fail.detail;

  //   TODO: 중복 로직 통합
  const handleSuccessCodeChange = (submission: SubmissionItem) => {
    setSuccessCode(submission);
  };

  const handleFailCodeChange = (submission: SubmissionItem) => {
    setFailCode(submission);
  };

  const AIRequest: AIGenerateRequestDTO = {
    problemId: problemId,
    problemName: problemName,
    problemTier: problemTier,
    successCode: successCode ? successCode.code : '',
    successCodeStart: 0,
    successCodeEnd: 0,
    failCode: failCode ? failCode.code : '',
    failCodeStart: 0,
    failCodeEnd: 0,
  };

  // AI 생성 api
  const AIgenerate = async (): Promise<string> => {
    try {
      const resp = await api.post(`/notes/ai-generate`, AIRequest);
      const content = resp.data.content;
      console.log('생성 완료', content);
      return content;
    } catch (err) {
      console.log(err);
      return '';
    }
  };

  const handleGenerateNote = async () => {
    setIsGenerating(true);
    try {
      const aiNoteContent = await AIgenerate();
      console.log(aiNoteContent);
      setNoteContent(aiNoteContent);
    } catch (error) {
      console.error('AI 노트 생성 실패:', error);
      alert('AI 노트 생성 실패. 다시 시도하세요');
    } finally {
      setIsGenerating(false);
    }
  };

  const noteGenerateRequest: noteGenerateRequestDTO = {
    problemId: problemId,
    problemName: problemName,
    problemTier: problemTier,
    noteTitle: title,
    content: noteContent,
    successCode: successCode ? successCode.code : '',
    successCodeStart: 0,
    successCodeEnd: 0,
    successLanguage: successCode ? successCode.language : '',
    failCode: failCode ? failCode.code : '',
    failCodeStart: 0,
    failCodeEnd: 0,
    failLanguage: failCode ? failCode.language : '',
    isPublic: visibility,
    isLiked: false,
    isFollowing: false,
  };

  //   노트 생성
  const handleSave = async () => {
    try {
      const resp = await api.post(`/notes`, noteGenerateRequest);
      const res = resp.data;
      const createdNoteId = res.noteId;
      alert('노트 생성 완료');
      navigate(`/note/${createdNoteId}`);
    } catch (err) {
      console.log('에러 발생');
      console.log(err);
    }
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
        <ProblemTitle
          problemId={problemId}
          problemName={problemName}
          problemTier={problemTier}
          fontSize="text-lg"
          fontColor="white"
        ></ProblemTitle>
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
                    checked={visibility === false}
                    onChange={() => setVisibility(false)}
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
                    checked={visibility === true}
                    onChange={() => setVisibility(true)}
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
    </div>
  );
}
