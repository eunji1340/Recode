import CodeList from '../components/code/CodeList';
import CodeEditor from '../components/code/CodeEditor';
import CodePreview from '../components/code/CodePreview';
import type { SubmissionItem} from '../types';
import type { NoteDetailResponseDTO } from '../types/NoteDetail';
import { useEffect, useState } from 'react';
import mockSubmissionApiResponse from '../data/MockSubmissionData';
import api from '../api/axiosInstance';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ProblemTitle from '../components/feed/ProblemTitle';
import type {
  AIGenerateRequestDTO,
  noteGenerateRequestDTO,
} from '@/types/note';

export default function NoteGeneratePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // 수정 모드인지 확인하고, 노트 데이터를 가져옵니다.
  const noteToEdit: NoteDetailResponseDTO | null = location.state?.note;
  const isEditing = !!noteToEdit;

  // 문제 정보는 수정/생성 모드에 따라 다르게 가져옵니다.
  const problemId = isEditing ? noteToEdit.problem.problemId : parseInt(id ?? '0', 10);
  const problemName = isEditing ? noteToEdit.problem.problemName : location.state?.problemName;
  const problemTier = isEditing ? noteToEdit.problem.problemTier : location.state?.problemTier;

  // 상태 초기값을 수정 모드인지에 따라 설정합니다.
  const [successCode, setSuccessCode] = useState<SubmissionItem | null>(
    isEditing
      ? ({ code: noteToEdit.successCode, language: noteToEdit.successLanguage } as SubmissionItem)
      : null,
  );
  const [failCode, setFailCode] = useState<SubmissionItem | null>(
    isEditing
      ? ({ code: noteToEdit.failCode, language: noteToEdit.failLanguage } as SubmissionItem)
      : null,
  );
  const [title, setTitle] = useState(isEditing ? noteToEdit.noteTitle : '새 노트 제목');
  const [noteContent, setNoteContent] = useState(
    isEditing
      ? noteToEdit.content
      : '여기에 본문을 입력하세요. **굵은 글씨**와 *기울임체*를 사용할 수 있습니다.',
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [visibility, setVisibility] = useState(isEditing ? noteToEdit.isPublic : true);

  // TODO: 문제 가져오기는 추후에 대체
  const successList = mockSubmissionApiResponse.data.pass.detail;
  const failList = mockSubmissionApiResponse.data.fail.detail;

  // TODO: 중복 로직 통합
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

  // 노트 저장 (생성/수정)
  const handleSave = async () => {
    try {
      if (isEditing) {
        // 수정 모드: PUT 요청
        if (!noteToEdit) return; // 노트 데이터가 없으면 종료
        const noteId = noteToEdit.noteId;
        const noteUpdateRequest = {
          noteTitle: title,
          content: noteContent,
          isPublic: visibility,
          problemId: problemId, // 문제 ID는 변경되지 않으므로 그대로 전달
          successCode: successCode?.code,
          successLanguage: successCode?.language,
          failCode: failCode?.code,
          failLanguage: failCode?.language,
          // 기타 필요한 필드들...
        };
        const resp = await api.put(`/notes/${noteId}`, noteUpdateRequest);
        console.log('노트 수정 완료', resp.data);
        alert('노트가 성공적으로 수정되었습니다.');
        navigate(`/note/${noteId}`);
      } else {
        // 생성 모드: POST 요청
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
        const resp = await api.post(`/notes`, noteGenerateRequest);
        const createdNoteId = resp.data.noteId;
        alert('노트가 성공적으로 생성되었습니다.');
        navigate(`/note/${createdNoteId}`);
      }
    } catch (err) {
      console.log('에러 발생');
      console.log(err);
      alert('노트 저장에 실패했습니다. 다시 시도해주세요.');
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
            <div className="success-code basis-1/2">
              <CodeList
                list={successList}
                name="success-code-selection"
                onCodeSelect={handleSuccessCodeChange}
                selectedCode={successCode}
              ></CodeList>
            </div>
            <div className="fail-code basis-1/2">
              <CodeList
                list={failList}
                name="fail-code-selection"
                onCodeSelect={handleFailCodeChange}
                selectedCode={failCode}
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
            {isEditing ? '수정하기' : '저장하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
