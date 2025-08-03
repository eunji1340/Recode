import MainFeed from '../components/feed/MainFeed';
import SearchBox from '../components/search/SearchBox';

const dummyFeeds = [
  {
    noteId: 17,
    noteTitle: 'DP 점화식 관련',
    content: '재산이 B, 이자가 R%, ...',
    successCode: `public class Main {
      public static void main(String[] args) {
        System.out.println("정답 코드");
      }
    }`,
    successCodeStart: 12,
    successCodeEnd: 18,
    failCode: `public class Main {
      public static void main(String[] args) {
        System.out.println("틀린 코드");
      }
    }`,
    failCodeStart: 3,
    failCodeEnd: 7,
    createdAt: '2025-07-21T13:00:00Z',
    viewCount: 114,
    likeCount: 8,
    commentCount: 2,
    isLiked: false,
    user: {
      userId: 3,
      nickname: '김싸피',
      image: 'https://cdn-icons-png.flaticon.com/512/147/147144.png',
    },
    problem: {
      problemId: 55,
      problemName: '14573번 엄청난 수열',
      tier: 11,
      language: 'Java',
    },
    tags: ['DP', '점화식'],
  },
  {
    noteId: 18,
    noteTitle: '스택 자료구조 활용법',
    content: '문자열 스택 처리가 핵심인데 중간 pop 조건을 놓쳤음',
    successCode: `def solve():
  print("정답 코드입니다")`,
    successCodeStart: 5,
    successCodeEnd: 10,
    failCode: `def solve():
  print("틀린 코드입니다")`,
    failCodeStart: 1,
    failCodeEnd: 3,
    createdAt: '2025-07-22T09:30:00Z',
    viewCount: 53,
    likeCount: 3,
    commentCount: 0,
    isLiked: true,
    user: {
      userId: 4,
      nickname: 'ssafy_user',
      image: '',
    },
    problem: {
      problemId: 2000,
      problemName: '2000번 문자열 폭발',
      tier: 9,
      language: 'Python',
    },
    tags: ['문자열', '스택', '스택', '스택'],
  },
];

const FeedPage = () => {
  const handleSearch = (params: {
    keyword: string;
    tags: string[];
    userScope?: 'all' | 'following';
  }) => {
    // 여기에서 검색 요청 또는 상태 처리
    console.log('검색 조건:', params);

    // 예: navigate(`/explore?keyword=...`)
    // 또는 Zustand에 저장해도 됨
  };

  //   TODO: detail 페이지로의 router 달기
  return (
    <div className="flex flex-col justify-center items-start p-6 gap-6">
      {dummyFeeds.map((item) => (
        <MainFeed key={`${item.noteId}-${item.user.userId}`} {...item} />
      ))}
    </div>
  );
};

export default FeedPage;
