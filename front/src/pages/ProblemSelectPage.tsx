import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import Problem from '../components/note/Problem';
import { useUserStore } from '../stores/userStore';
import ProtectedOverlay from '../components/common/ProtectedOverlay';
import Cookies from '../api/Cookies';

interface ProblemType {
  id: number;
  title: string;
  level: number;
}

export default function ProblemSelectPage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [problems, setProblems] = useState<ProblemType[]>([]);
  const [searched, setSearched] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //   로그인 여부 확인
  const isLoggedIn = useUserStore((state) => state.isAuthenticated);
  if (!isLoggedIn) {
    return <ProtectedOverlay />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setSearched(true);
    try {
      const resp = await api.get(`/solvedac/suggestion?query=${query}`);
      setProblems(resp.data.problems);
    } catch (err) {
      console.error(err);
      setProblems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            노트 생성할 문제 선택
          </h1>
          <div>
            <p className="text-gray-600">
              풀었던 문제의 제목이나 번호를 검색하여 노트를 생성해보세요.
            </p>
            <p className="text-gray-600 mb-4">
              제출 내역을 불러오기 위해 백준 로그인이 필요해요.
            </p>
          </div>

          <div className="mb-4 flex flex-row items-center justify-center gap-4">
            <button
              onClick={openModal}
              className="px-6 py-2 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
            >
              백준 로그인하고 쿠키 가져오기
            </button>
            {/* <Cookies></Cookies> */}
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
              <h2 className="text-2xl font-bold mb-4">
                왜 백준에 로그인해야 하나요?
              </h2>
              <ul className="list-inside space-y-2 text-gray-700">
                <li>
                  백준 제출 내역을 자동으로 가져오기 위해서는 쿠키가 필요해요.
                </li>
                <li>
                  확장 프로그램을 통해, 백준 아이디로 로그인해 쿠키를 자동으로
                  가져올 수 있어요.
                </li>
                <li>가져온 쿠키는 안전하게 저장됩니다.</li>
                <li>
                  <Cookies></Cookies>
                </li>
              </ul>
              <div className="mt-6 text-center">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-full hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex justify-center mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="예: 1000 A+B"
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white font-semibold rounded-r-full hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
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
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        </form>

        <div className="bg-white rounded-lg shadow-md p-6 min-h-[300px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
            </div>
          ) : !searched ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">문제 검색을 시작해주세요.</p>
            </div>
          ) : problems.length > 0 ? (
            <ul className="space-y-3">
              {problems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={`/note/generate/${item.id}`}
                    state={{
                      problemName: item.title,
                      problemTier: item.level,
                    }}
                    className="block"
                  >
                    <Problem
                      id={item.id}
                      name={item.title}
                      level={item.level}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
