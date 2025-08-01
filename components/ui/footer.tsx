"use client";

import { useState, useEffect, useRef, useCallback, RefObject } from "react";
import { motion } from "framer-motion";

type FooterProps = {
  prompt: string;
  currentCommand: string;
  setCurrentCommand: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: RefObject<HTMLInputElement | null>;
};

const Footer: React.FC<FooterProps> = ({
  prompt,
  currentCommand,
  setCurrentCommand,
  handleKeyDown,
  inputRef,
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [caretLeft, setCaretLeft] = useState(0);
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const updateCaret = useCallback(() => {
    if (!spanRef.current || !inputRef.current) return;
    const selectionStart = inputRef.current.selectionStart ?? 0;
    const fullText = currentCommand.slice(0, selectionStart);

    spanRef.current.textContent = fullText || " ";
    const width = spanRef.current.offsetWidth;
    setCaretLeft(width);
    setSelection({
      start: selectionStart,
      end: inputRef.current.selectionEnd ?? selectionStart,
    });
  }, [currentCommand]);

  useEffect(() => {
    updateCaret();
  }, [currentCommand, updateCaret]);

  return (
    <footer className="bg-transparent p-4 md:p-0 md:pt-4 text-muted-foreground text-xs">
      <div className="flex flex-col items-start md:flex-row md:items-center gap-2 mb-4 md:mb-1">
        <span className="text-rose-500 font-medium">{prompt}</span>

        <div
          onClick={() => inputRef.current?.focus()}
          className="relative flex-1 min-w-0 min-h-4 md:min-h-0"
        >
          {/* Hidden native input */}
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={(e) => {
              handleKeyDown(e);
              requestAnimationFrame(updateCaret);
            }}
            onSelect={updateCaret}
            className="absolute inset-0 w-full h-full opacity-0 caret-transparent"
            spellCheck={false}
            autoComplete="off"
            autoFocus
          />

          {/* Fake text and selection highlight */}
          <div className="relative whitespace-pre text-foreground font-normal">
            <span>
              {currentCommand.substring(0, selection.start)}
              <span className="bg-primary/20 text-primary-foreground">
                {currentCommand.substring(selection.start, selection.end)}
              </span>
              {currentCommand.substring(selection.end)}
            </span>

            {/* Measuring span */}
            <span
              ref={spanRef}
              className="absolute left-0 top-0 invisible whitespace-pre"
            ></span>

            {/* Blinking caret */}
            <motion.div
              ref={cursorRef}
              animate={{ left: caretLeft }}
              transition={{ type: "tween", ease: "linear", duration: 0.05 }}
              className="absolute top-1/2 -translate-y-[calc(50%-7px)] w-3 h-[1px] bg-rose-500 animate-blink"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground md:block hidden">
          Press Ctrl+L to clear, Tab for autocomplete
        </span>
        <span className="text-muted-foreground">Connected to @msafdev</span>
      </div>
    </footer>
  );
};

export default Footer;
