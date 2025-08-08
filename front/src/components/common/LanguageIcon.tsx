import { PiQuestionBold } from "react-icons/pi";

interface LanguageIconProps {
  language?: string;
}

const getLanguageIconUrl = (lang?: string): string | null => {
  if (!lang) return null;
  const exceptions: Record<string, string> = {
    'C++': 'cplusplus',
    'C#': 'csharp',
  };
  const key = exceptions[lang] ?? lang.toLowerCase();
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${key}/${key}-original.svg`;
};

export default function LanguageIcon({ language }: LanguageIconProps) {
  const iconUrl = getLanguageIconUrl(language);
  if (!iconUrl) return (
    <div className="flex items-center gap-1">
      <PiQuestionBold className="w-5 h-5 text-[#13233D]"/>
      <span className="text-xs text-zinc-400">언어 없음</span>
    </div>
  );

return (
  <div className="flex items-center gap-1 text-sm">
    <img
      src={iconUrl}
      alt={`${language} icon`}
      className="w-5 h-5"
    />
    <span className="text-xs">{language}</span>
  </div>
);
}