"use client";

import React, { Fragment, useEffect, useRef } from "react";
import { useTerminal } from "@/hooks/use-terminal";
import { personalInfo } from "@/lib/data";

import { AnimatedItem, AnimatedTerminalOutput, Prompt } from "@/lib/commands";
import { AnimatePresence } from "motion/react";
import Footer from "./footer";

const Terminal: React.FC = () => {
  const {
    history,
    currentCommand,
    setCurrentCommand,
    handleKeyDown,
    inputRef,
  } = useTerminal();

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on history update
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [history]);

  const prompt = `${personalInfo.name
    .toLowerCase()
    .replace(" ", "")}@portfolio:~$`;

  return (
    <section className="h-full flex flex-col text-sm text-foreground">
      <nav className="md:flex hidden bg-transparent items-center gap-1 pb-2 justify-end text-muted-foreground text-sm">
        <p>✅</p>
        <p>❎</p>
      </nav>

      {/* Scrollable Command Output Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 border md:rounded-sm bg-background flex flex-col"
      >
        <AnimatePresence mode="wait">
          {/* Welcome Message */}
          <AnimatedTerminalOutput className="mb-4 space-y-4">
            <AnimatedItem className="text-foreground font-medium text-xs">
              ✴ Welcome
            </AnimatedItem>
            <AnimatedItem className="text-muted-foreground text-xs ml-4.5">
              Salman here, a product designer and all-around design generalist.
              This is a portfolio template, a place where{" "}
              <span className="text-foreground">YOU</span> can use and
              experiment with new ideas and technologies.
            </AnimatedItem>
            <AnimatedItem className="text-muted-foreground text-xs ml-4.5">
              Type <span className="text-foreground">'help'</span> to see
              available commands. Use{" "}
              <span className="text-foreground">↑ ↓</span> for command history.
            </AnimatedItem>
          </AnimatedTerminalOutput>

          {/* Command History */}
          {history.map((entry) => (
            <Fragment key={entry.id}>
              <Prompt command={entry.command} prompt={prompt} />
              {entry.output}
            </Fragment>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer Input */}
      <Footer
        prompt={prompt}
        currentCommand={currentCommand}
        setCurrentCommand={setCurrentCommand}
        handleKeyDown={handleKeyDown}
        inputRef={inputRef}
      />
    </section>
  );
};

export default Terminal;
