import { PiQuestionBold } from "react-icons/pi";

interface LanguageIconProps {
  language?: string;
  size?: number; // 아이콘 크기(px)
}

/**
 * BOJ 언어명 → devicon 아이콘 key 변환
 */
const languageMap: Record<string, string> = {
  'Python3': 'python',
  'PyPy3': 'python',
  'C++': 'cplusplus',
  'C++98': 'cplusplus',
  'C++11': 'cplusplus',
  'C++14': 'cplusplus',
  'C++17': 'cplusplus',
  'C++20': 'cplusplus',
  'C++23': 'cplusplus',
  'C++26': 'cplusplus',
  'C#': 'csharp',
  'Java 8': 'java',
  'Java 11': 'java',
  'Java 15': 'java',
  'Kotlin (JVM)': 'kotlin',
  'node.js': 'nodejs',
  'Go': 'go',
  'Rust 2018': 'rust',
  'Rust 2021': 'rust',
  'Rust 2015': 'rust',
  'Swift': 'swift',
  'TypeScript': 'typescript',
  'PHP': 'php',
  'Ruby': 'ruby',
  'Text': 'markdown',
  // 필요하면 계속 추가
};

/**
 * LanguageIcon - 언어 아이콘 + 이름 표시
 * @param language 언어명
 * @param size 아이콘 크기(px)
 */
export default function LanguageIcon({ language, size = 20 }: LanguageIconProps) {
  if (!language) {
    return (
      <div className="flex items-center gap-1">
        <PiQuestionBold className="text-[#13233D]" style={{ width: size, height: size }} />
        <span className="text-xs text-zinc-400">언어 없음</span>
      </div>
    );
  }

  const fontSize = Math.round(size * 0.75);
  const key = languageMap[language] ?? language.toLowerCase();
  const iconUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${key}/${key}-original.svg`;

  return (
    <div className="flex items-center gap-1 text-sm">
      <img
        src={iconUrl}
        alt={`${language} icon`}
        className="object-contain"
        style={{ width: size, height: size }}
        onError={(e) => {
          // 이미지 로드 실패 시 대체 아이콘
          <PiQuestionBold className="text-[#13233D]" style={{ width: size, height: size }} />          
          e.currentTarget.onerror = null;
          e.currentTarget.style.display = 'none';
        }}
      />
      <span style={{ fontSize }} className="font-mono">{language}</span>
    </div>
  );
}
