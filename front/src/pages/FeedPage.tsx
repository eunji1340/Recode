import MainFeed from '../components/feed/MainFeed';

const dummyFeeds = [
  {
    note_id: 17,
    user_id: 3,
    problem_id: 55,
    problem_name: '14573번 엄청난 수열',
    tier: 11,
    note_title: 'DP 점화식 관련',
    content: '재산이 B, 이자가 R%, 매달 갚는 돈이 M일 때 갚는 것이 가능하다면 몇달째에 갚는지, 불가능하다면 impossible을 출력하는 문제. 계산 및 센트단위로 반올림하는 과정에서 소수점 오차를 잘 컨트롤 하면 된다.',
    success_code: `public class Main {
      public static void main(String[] args) {
        System.out.println("정답 코드");
      }
    }`,
    success_code_start: 12,
    success_code_end: 18,
    fail_code: `public class Main {
      public static void main(String[] args) {
        System.out.println("틀린 코드");
      }
    }`,
    fail_code_start: 3,
    fail_code_end: 7,
    is_public: true,
    created_at: '2025-07-21T13:00:00Z',
    updated_at: '2025-07-21T13:30:00Z',
    view_count: 114,
    like_count: 8,
    comment_count: 2,
    tags: ['DP', '점화식'],
    nickname: '김싸피',
    profile_image: 'https://example.com/profile.jpg',
    liked: false,
  },
  {
    note_id: 18,
    user_id: 4,
    problem_id: 2000,
    problem_name: '2000번 문자열 폭발',
    tier: 9,
    note_title: '스택 자료구조 활용법',
    content: '문자열 스택 처리가 핵심인데 중간 pop 조건을 놓쳤음',
    success_code: `def solve():
  print("정답 코드입니다")`,
    success_code_start: 5,
    success_code_end: 10,
    fail_code: `def solve():
  print("틀린 코드입니다")`,
    fail_code_start: 1,
    fail_code_end: 3,
    is_public: true,
    created_at: '2025-07-22T09:30:00Z',
    updated_at: '2025-07-22T10:00:00Z',
    view_count: 53,
    like_count: 3,
    comment_count: 0,
    tags: ['문자열', '스택'],
    nickname: 'ssafy_user',
    profile_image: 'https://example.com/user4.jpg',
    liked: true,
  },
  {
    note_id: 17,
    user_id: 3,
    problem_id: 55,
    problem_name: '14573번 엄청난 수열',
    tier: 11,
    note_title: 'DP 점화식 관련',
    content: '재산이 B, 이자가 R%, 매달 갚는 돈이 M일 때 갚는 것이 가능하다면 몇달째에 갚는지, 불가능하다면 impossible을 출력하는 문제. 계산 및 센트단위로 반올림하는 과정에서 소수점 오차를 잘 컨트롤 하면 된다.',
    success_code: `public class Main {
      public static void main(String[] args) {
        System.out.println("정답 코드");
      }
    }`,
    success_code_start: 12,
    success_code_end: 18,
    fail_code: `public class Main {
      public static void main(String[] args) {
        System.out.println("틀린 코드");
      }
    }`,
    fail_code_start: 3,
    fail_code_end: 7,
    is_public: true,
    created_at: '2025-07-21T13:00:00Z',
    updated_at: '2025-07-21T13:30:00Z',
    view_count: 114,
    like_count: 8,
    comment_count: 2,
    tags: ['DP', '점화식'],
    nickname: '김싸피',
    profile_image: 'https://example.com/profile.jpg',
    liked: false,
  },
];

const MainFeedPage = () => {
  return (
    <div className="flex flex-col justify-center items-start p-6 gap-6">
      {dummyFeeds.map((item) => (
        <MainFeed key={item.note_id} {...item} />
      ))}
    </div>
  );
};

export default MainFeedPage;
