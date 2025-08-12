// components/feed/TagList.tsx
import React, { useEffect, useRef, useState } from 'react';
import Tag from '../common/Tag';

interface Props {
  tags: string[];
  maxWidth: number; // in px
}

export default function TagList({ tags, maxWidth }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(tags.length);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const tagWidths = tags.map((tag) => {
      const temp = document.createElement('span');
      temp.style.visibility = 'hidden';
      temp.style.position = 'absolute';
      temp.className =
        'inline-flex items-center gap-[2px] border border-[#A0BACC] bg-[#E6EEF4] text-[#13233D] rounded-full px-2 py-[2px] text-xs font-medium flex-shrink-0';
      temp.innerText = `# ${tag}`;
      document.body.appendChild(temp);
      const width = temp.offsetWidth + 4;
      document.body.removeChild(temp);
      return width;
    });

    const plus = document.createElement('span');
    plus.style.visibility = 'hidden';
    plus.style.position = 'absolute';
    plus.className =
      'text-[10px] text-zinc-400 font-medium whitespace-nowrap';
    plus.innerText = '+99';
    document.body.appendChild(plus);
    const plusWidth = plus.offsetWidth + 4;
    document.body.removeChild(plus);

    let total = 0;
    let count = 0;
    for (let i = 0; i < tagWidths.length; i++) {
      const nextWidth = total + tagWidths[i];
      const remaining = tagWidths.length - (i + 1);
      const needPlus = remaining > 0;
      if (needPlus && nextWidth + plusWidth > maxWidth) break;
      if (!needPlus && nextWidth > maxWidth) break;
      total = nextWidth;
      count++;
    }

    setVisibleCount(Math.max(1, count));
  }, [tags, maxWidth]);

  return (
    <div ref={ref} className="flex items-center gap-1 overflow-hidden max-w-full">
      {tags.slice(0, visibleCount).map((tag, idx) => (
        <Tag key={idx} tagName={tag} />
      ))}
      {visibleCount < tags.length && (
        <span className="text-[10px] text-zinc-400 font-medium whitespace-nowrap">
          +{tags.length - visibleCount}
        </span>
      )}
    </div>
  );
}