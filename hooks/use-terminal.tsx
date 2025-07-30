"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { CommandOutput } from "@/types/command.types";
import { commands } from "@/lib/commands";

export const useTerminal = () => {
  const [history, setHistory] = useState<CommandOutput[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentCommand, setCurrentCommand] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount and document click
  useEffect(() => {
    const handleClick = () => inputRef.current?.focus();
    document.addEventListener("click", handleClick);
    inputRef.current?.focus();

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const executeCommand = useCallback((command: string) => {
    const trimmed = command.trim();
    if (!trimmed) return;

    const [cmd, ...args] = trimmed.split(" ");
    const name = cmd.toLowerCase();

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    if (name === "clear") {
      setHistory([]);
      setCurrentCommand("");
      return;
    }

    const commandObj = commands[name];
    let output: React.ReactNode;

    if (commandObj) {
      output = commandObj.execute(args);
    } else {
      output = (
        <p className="text-destructive font-normal text-xs">
          ✕ Command '{name}' not found. Type 'help' for available commands.
        </p>
      );
    }

    const newEntry: CommandOutput = {
      id: `${Date.now()}-${crypto.randomUUID()}`,
      command: trimmed,
      output,
      timestamp: new Date(),
    };

    setHistory((prev) => [...prev, newEntry]);
    setCurrentCommand("");
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const { key, ctrlKey } = e;

      if (key === "Enter") {
        executeCommand(currentCommand);
      } else if (key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length === 0) return;

        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);

        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      } else if (key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex === -1) return;

        const newIndex = historyIndex + 1;

        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentCommand("");
        } else {
          setHistoryIndex(newIndex);
          setCurrentCommand(commandHistory[newIndex]);
        }
      } else if (key === "Tab") {
        e.preventDefault();
        const input = currentCommand.toLowerCase();
        const matches = Object.keys(commands).filter((cmd) =>
          cmd.startsWith(input)
        );
        if (matches.length === 1) {
          setCurrentCommand(matches[0]);
        }
      } else if (ctrlKey && key === "c") {
        e.preventDefault();
        setCurrentCommand("");
      } else if (ctrlKey && key === "l") {
        e.preventDefault();
        executeCommand("clear");
      }
    },
    [currentCommand, commandHistory, historyIndex, executeCommand]
  );

  return {
    history,
    currentCommand,
    setCurrentCommand,
    handleKeyDown,
    inputRef,
    executeCommand,
  };
};
