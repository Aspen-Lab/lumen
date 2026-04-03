"use client";

import { useRef, useEffect, useId } from "react";

/**
 * AutoTextarea — Self-sizing textarea
 *
 * UI: Seamless text input that grows with content, no scrollbar until maxHeight
 * SWE: useEffect recalculates height on every value change
 *      Scoped <style> tag for placeholder color (can't be set inline)
 *      useId() for unique scoping — safe with SSR
 */

export interface AutoTextareaProps {
  value: string;
  onChange: (value: string) => void;
  onFocusChange: (focused: boolean) => void;
  placeholder: string;
  maxHeight?: number;
  textColor: string;
  placeholderColor: string;
  bgColor: string;
}

export function AutoTextarea({
  value, onChange, onFocusChange, placeholder,
  maxHeight = 120, textColor, placeholderColor, bgColor,
}: AutoTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const id = useId();
  const scopeClass = `ta-${id.replace(/:/g, "")}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
  }, [value, maxHeight]);

  return (
    <div className="px-5 pt-4 pb-2" style={{ background: bgColor }}>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => onFocusChange(true)}
        onBlur={() => onFocusChange(false)}
        placeholder={placeholder}
        rows={1}
        className={`${scopeClass} w-full bg-transparent text-base outline-none resize-none leading-relaxed`}
        style={{ minHeight: 28, maxHeight, color: textColor }}
      />
      <style>{`.${scopeClass}::placeholder { color: ${placeholderColor}; }`}</style>
    </div>
  );
}
