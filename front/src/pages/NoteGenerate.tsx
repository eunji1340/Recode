import CodeList from '../components/code/CodeList';
<<<<<<< HEAD
<<<<<<< HEAD
import CodeEditor from '../components/code/CodeEditor';
import CodePreview from '../components/code/CodePreview';
<<<<<<< HEAD
import type { SubmissionItem } from '../types';
import { useState } from 'react';
import mockSubmissionApiResponse from '../data/MockSubmissionData';

export default function NoteGenerate() {
  const [successCode, setSuccessCode] = useState<SubmissionItem | null>(null);
  const [failCode, setFailCode] = useState<SubmissionItem | null>(null);

  // TODO: fetch 변경 & 비동기 로직 추가
  const successList = mockSubmissionApiResponse.data.pass.detail;
  const failList = mockSubmissionApiResponse.data.fail.detail;

  //   TODO: 중복 로직 통합
  const handleSuccessCodeChange = (submission: SubmissionItem) => {
    setSuccessCode(submission);
  };

  const handleFailCodeChange = (submission: SubmissionItem) => {
    setFailCode(submission);
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
          <div className="code-preview flex">
            <div className="success-code basis-1/2">
              <h2>성공코드</h2>
              <CodePreview
                code={successCode?.code}
                language={successCode?.language}
              ></CodePreview>
            </div>
            <div className="fail-code basis-1/2">
              <h2>실패코드</h2>
              <CodePreview
                code={failCode?.code}
                language={failCode?.language}
              ></CodePreview>
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
