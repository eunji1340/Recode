import MainFeed from '../components/mainfeed/MainFeed'

export const dummyFeeds = [
  {
    id: 1,
    level: 3,
    title: "문제번호 1000",
    content: "피드에서 보여줄 요약 내용입니다.",
    timeAgo: "1일 전",
    nickname: "김싸피",
    language: "C++",
    tags: ["bfs", "그래프", "시뮬레이션"],
    likes: 3,
    comments: 2,
    liked: false,
  },
  {
    id: 2,
    level: 4,
    title: "문제번호 2000",
    content: "이 코드는 왜 틀렸을까?",
    timeAgo: "2일 전",
    nickname: "ssafy_dev",
    language: "Python",
    tags: ["dp", "재귀", "오답노트"],
    likes: 5,
    comments: 1,
    liked: true,
  },
  // ...더 추가 가능
];

const MainFeedPage = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] px-4">
      <MainFeed feeds={dummyFeeds} />
    </div>
  );
};

export default MainFeedPage;