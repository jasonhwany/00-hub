"use client";

import { useState } from "react";

export interface FaqItem {
  question: string;
  answer: string; // 줄바꿈은 \n으로 처리
}

interface FaqAccordionProps {
  items: FaqItem[];
  title?: string;
}

export default function FaqAccordion({
  items,
  title = "자주 묻는 질문",
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function handleToggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return (
    <section aria-label={title} className="mb-6">
      <h3
        className="text-base font-semibold mb-3"
        style={{ color: "#1A1A1A" }}
      >
        {title}
      </h3>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid #E8E4DD", backgroundColor: "#FFFFFF" }}
      >
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          const isLast = index === items.length - 1;

          return (
            <div
              key={index}
              style={
                isLast ? undefined : { borderBottom: "1px solid #E8E4DD" }
              }
            >
              {/* 질문 버튼 */}
              <button
                type="button"
                onClick={() => handleToggle(index)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left transition-colors"
                style={{
                  backgroundColor: isOpen ? "#FAFAF7" : "#FFFFFF",
                  cursor: "pointer",
                }}
              >
                <span
                  className="text-sm font-medium leading-snug"
                  style={{ color: "#1A1A1A" }}
                >
                  {item.question}
                </span>
                <span
                  className="shrink-0 text-base select-none transition-transform duration-200"
                  style={{
                    color: "#B8860B",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    display: "inline-block",
                  }}
                  aria-hidden="true"
                >
                  ▼
                </span>
              </button>

              {/* 답변 영역 */}
              {isOpen && (
                <div
                  className="px-5 pb-4 pt-1"
                  style={{ backgroundColor: "#FAFAF7" }}
                >
                  {item.answer.split("\n").map((line, i) => (
                    <p
                      key={i}
                      className="text-sm leading-relaxed"
                      style={{ color: "#6B6B6B" }}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
