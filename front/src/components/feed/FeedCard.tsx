import FeedCardHeader from "./FeedCardHeader";
import FeedCardContent from "./FeedCardContent";
import FeedCardFooter from "./FeedCardFooter";

const FeedCard = () => {
  return (
    <div className="w-[320px] h-[300px] bg-white rounded-xl shadow p-6 overflow-hidden flex flex-col justify-between hover:shadow-md transition cursor-pointer">
      <FeedCardHeader
        level={5}
        title="4485 녹색 옷 입은 애가 젤다지?"
        timeAgo="1일 전"
        nickname="김싸피"
      />

      <FeedCardContent
        content="점화식 설계의 중요성!"
      />

      <FeedCardFooter
        language="Python"
        tags={['DP', 'dfs', '태그', '태그', '태그']}
        likes={15}
        comments={8}
      />
    </div>
  );
};


export default FeedCard;