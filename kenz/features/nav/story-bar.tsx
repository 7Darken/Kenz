"use client";

/**
 * La barre « stories » de l'accueil Créateur : un segment par chapitre (sections #top, #voyage, #sport,
 * #suivre), rempli à mesure de la lecture ; le chapitre courant est annoncé (aria-current="step") et
 * remonté au parent (le nom affiché dans la nav). Portage de createur.html (frame()).
 */
import { useEffect, useRef } from "react";

import { remeasureChapters, subscribeChapters } from "@/design-system/lib/chapters";
import styles from "./story-bar.module.css";

export interface StoryChapter {
  id: string;
  label: string;
}

interface StoryBarProps {
  chapters: readonly StoryChapter[];
  label: string;
  onChapterChange: (index: number) => void;
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function StoryBar({ chapters, label, onChapterChange }: StoryBarProps) {
  const listRef = useRef<HTMLElement>(null);
  const onChangeRef = useRef(onChapterChange);

  useEffect(() => {
    onChangeRef.current = onChapterChange;
  }, [onChapterChange]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const segments = Array.from(list.children) as HTMLElement[];
    let sections: { top: number; height: number }[] = [];
    let current = -1;

    const measure = () => {
      const y = window.scrollY;
      sections = chapters.map(({ id }) => {
        const rect = document.getElementById(id)?.getBoundingClientRect();
        return rect ? { top: rect.top + y, height: Math.max(1, rect.height) } : { top: Infinity, height: 1 };
      });
    };

    const frame = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const reference = y + vh * 0.35 * Math.min(1, y / (vh * 0.5));
      const atEnd = y >= document.documentElement.scrollHeight - vh - 4;
      let active = 0;
      sections.forEach((section, index) => {
        const fill = atEnd ? 1 : clamp01((reference - section.top) / section.height);
        const segment = segments[index];
        segment?.style.setProperty("--fill", fill.toFixed(4));
        segment?.toggleAttribute("data-done", fill >= 0.999);
        if (section.top <= reference + 1) active = index;
      });
      if (atEnd) active = sections.length - 1;
      if (active !== current) {
        current = active;
        segments.forEach((segment, index) =>
          index === active ? segment.setAttribute("aria-current", "step") : segment.removeAttribute("aria-current"),
        );
        onChangeRef.current(active);
      }
    };

    const unsubscribe = subscribeChapters({ onMeasure: measure, onFrame: frame });
    remeasureChapters();
    return unsubscribe;
  }, [chapters]);

  return (
    <nav ref={listRef} className={styles.story} aria-label={label}>
      {chapters.map((chapter) => (
        <a key={chapter.id} className={styles.segment} href={`#${chapter.id}`}>
          <i className={styles.fill} />
          <span className="sr">{chapter.label}</span>
        </a>
      ))}
    </nav>
  );
}
