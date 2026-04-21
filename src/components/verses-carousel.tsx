import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type Verse = {
  verse: string;
  from: string;
};

type Props = {
  verses: Verse[];
  interval?: number;
  className?: string;
};

export const VerseCarousel: React.FC<Props> = ({
  verses,
  interval = 10000,
  className = "",
}) => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const safeVerses = useMemo(() => verses ?? [], [verses]);
  const count = safeVerses.length;

  const next = () => {
    if (!count) return;
    setIndex((current) => (current + 1) % count);
  };

  const prev = () => {
    if (!count) return;
    setIndex((current) => (current - 1 + count) % count);
  };

  useEffect(() => {
    // Pause auto-advance when there is no content, hover pause is active, or the interval is invalid.
    if (!count || isPaused || interval <= 0) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [count, interval, isPaused]);

  useEffect(() => {
    if (index >= count) {
      setIndex(0);
    }
  }, [count, index]);

  if (!count) return null;

  const current = safeVerses[index];

  return (
    <div
      className={`relative mx-auto w-full max-w-3xl overflow-hidden  ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >


      <div className="relative rounded-[1.7rem]  px-5 py-6 text-center md:px-8 ">

        <div className="mx-auto flex max-w-4xl items-center gap-2 md:gap-4">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous verse"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full  text-slate-50 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 md:h-12 md:w-12"
          >
            <FiChevronLeft className="text-xl md:text-2xl" />
          </button>

          <div className="flex-1">
            <p className="monst-semibold text-xl leading-relaxed text-slate-50 transition-opacity duration-300 md:text-3xl">
              "{current.verse}"
            </p>
            <span className="inter-semibold mt-5 block text-sm uppercase tracking-[0.22em] text-orange-100 md:text-base">
              {current.from}
            </span>
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Next verse"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full  text-white shadow-[0_14px_28px_rgba(234,88,12,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(234,88,12,0.28)] md:h-12 md:w-12"
          >
            <FiChevronRight className="text-xl md:text-2xl" />
          </button>
        </div>
      </div>
    </div>
  );
};
