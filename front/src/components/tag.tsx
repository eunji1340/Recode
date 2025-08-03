type TagProps = {
  name: string;
  url?: string; // 추후 확장 위함
};
export default function Tag({ name, url }: TagProps) {
  return (
    <span className="bg-[#D9D9D9] rounded-full bold">
      #{name}
      {url && <a href={url}>{url}</a>}
    </span>
  );
}
