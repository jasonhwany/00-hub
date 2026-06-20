"use client";

import { trackEvent } from "../lib/gtag";

interface ToolCardProps {
  name: string;
  desc: string;
  url: string;
  live: boolean;
}

export default function ToolCard({ name, desc, url, live }: ToolCardProps) {
  return (
    <a
      href={live ? url : undefined}
      onClick={() => live && trackEvent("tool_card_click", { tool: name })}
      className={[
        "block rounded-xl border p-5 transition-all",
        live
          ? "bg-white border-[#E8E4DD] hover:border-[#B8860B] hover:bg-[#F5EDD8] shadow-sm cursor-pointer"
          : "bg-white border-[#E8E4DD] opacity-50 cursor-not-allowed",
      ].join(" ")}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold" style={{ color: "#1A1A1A" }}>{name}</span>
        {live ? (
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "#EAF4EE", color: "#2A6B4A" }}
          >
            LIVE
          </span>
        ) : (
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "#F0EDE8", color: "#6B6B6B" }}
          >
            준비중
          </span>
        )}
      </div>
      <p className="text-sm" style={{ color: "#6B6B6B" }}>{desc}</p>
    </a>
  );
}
