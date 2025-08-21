'use client';

import { useEffect, useRef, useState } from 'react';
import ImageButton from '@/components/common/atoms/ImageButton';
import ImageThumb from '@/components/test-add/ImageThumb';
import Image from 'next/image';

type Props = {
  files: File[];
  total: number;
  onUpload: (files: FileList) => void;
  onRemove: (index: number) => void;
};

export default function ImageStrip({ files, total, onUpload, onRemove }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [canRight, setCanRight] = useState(false);

  const checkScroll = () => {
    const el = wrapRef.current;
    if (!el) return;
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  useEffect(() => {
    checkScroll();
  }, [files]);

  return (
    <div className="relative">
      <div
        ref={wrapRef}
        onScroll={checkScroll}
        className="
          flex items-center gap-4 overflow-x-auto
          py-2 pr-10
          scrollbar-thin
        "
      >
        <ImageButton
          current={files.length}
          total={total}
          onUpload={fl => {
            if (!fl || fl.length === 0) return;
            onUpload(fl);
          }}
        />
        {files.map((f, i) => (
          <ImageThumb key={`${f.name}-${i}`} file={f} onRemove={() => onRemove(i)} />
        ))}
      </div>
      {canRight && (
        <button
          type="button"
          aria-label="오른쪽으로 더 보기"
          onClick={() => {
            const el = wrapRef.current;
            if (!el) return;
            el.scrollBy({ left: 200, behavior: 'smooth' });
          }}
          className="
            absolute right-0 top-1/2 -translate-y-1/2
            h-9 w-9 rounded-full bg-White shadow
            flex items-center justify-center
            border border-Gray-100
          "
        >
          <Image src="icons/input-icon/circle-x.svg" alt="cancel" width={24} height={24} />
        </button>
      )}
    </div>
  );
}
