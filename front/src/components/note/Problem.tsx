type Props = {
  id: number;
  name: string;
  level: number;
};

export default function Problem({ id, name, level }: Props) {
  return (
    <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200">
      <img
        src={`/tiers/${level}.png`}
        alt={`Tier ${level}`}
        className="w-6 h-6 mr-4"
      />
      <div className="flex-grow">
        <span className="font-semibold text-gray-800">{id}</span>
        <span className="ml-2 text-gray-700">{name}</span>
      </div>
    </div>
  );
}
