import React from "react";
import { Command } from "@/types/command.types";
import { personalInfo, projects, skills } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

import { motion, easeIn } from "motion/react";
import Link from "next/link";

import { format } from "date-fns";
import { enUS } from "date-fns/locale";

const createProjectCard = (project: (typeof projects)[0]) => (
  <AnimatedItem
    key={project.name}
    className="cursor-pointer space-y-1 group/project relative w-full max-w-3xs"
  >
    <p className="text-foreground group-hover/project:italic flex items-center text-xs font-semibold justify-between">
      {project.name}
    </p>
    <div className="absolute right-0 top-0 opacity-0 group-hover/project:opacity-100 transition-opacity">
      ↗
    </div>
    <div className="flex flex-wrap gap-2 items-center">
      {project.type.map((tech, index) => (
        <p key={tech} className="text-xs text-muted-foreground">
          {tech}
          {index !== project.type.length - 1 && ", "}
        </p>
      ))}
    </div>
  </AnimatedItem>
);

// Consistent animation variants
const ANIMATION_CONFIG = {
  duration: 0.2,
  stagger: 0.06,
  delay: 0.08,
  easing: easeIn,
};

const terminalVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: ANIMATION_CONFIG.stagger,
      delayChildren: ANIMATION_CONFIG.delay,
    },
  },
};

const itemVariant = {
  hidden: {
    opacity: 0,
    filter: "blur(2px)",
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: ANIMATION_CONFIG.duration,
      ease: ANIMATION_CONFIG.easing,
    },
  },
};

export const AnimatedTerminalOutput = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    variants={terminalVariant}
    initial="hidden"
    animate="visible"
    exit="exit"
    className={className}
  >
    {children}
  </motion.div>
);

export const AnimatedItem = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div variants={itemVariant} className={className}>
    {children}
  </motion.div>
);

export const commands: Record<string, Command> = {
  help: {
    name: "help",
    description: "Display available commands",
    execute: () => (
      <AnimatedTerminalOutput className="space-y-2 text-xs">
        <AnimatedItem className="text-muted-foreground mb-6">
          ➤ Available Commands:
        </AnimatedItem>
        {Object.values(commands).map((cmd) => (
          <AnimatedItem
            key={cmd.name}
            className="flex items-start gap-4 ml-4.5"
          >
            <span className="text-foreground font-semibold min-w-32">
              {cmd.name}
            </span>
            <span className="text-muted-foreground">{cmd.description}</span>
          </AnimatedItem>
        ))}
        <AnimatedItem className="text-muted-foreground mt-6 ml-4.5">
          Want to see more? Visit my main{" "}
          <Link
            href={"https://salmoon.vercel.app"}
            target="_blank"
            className="text-foreground hover:italic"
          >
            portfolio
          </Link>
        </AnimatedItem>
      </AnimatedTerminalOutput>
    ),
  },

  whoami: {
    name: "whoami",
    description: "Display information about me",
    execute: () => (
      <AnimatedTerminalOutput className="ml-4.5 space-y-2 text-xs">
        <AnimatedItem className="text-foreground text-sm font-semibold">
          {personalInfo.name}
        </AnimatedItem>
        <AnimatedItem className="text-muted-foreground mb-4">
          {personalInfo.bio}
        </AnimatedItem>
        <AnimatedItem>
          <span className="text-foreground">Email:</span> {personalInfo.email}
        </AnimatedItem>
        <AnimatedItem>
          <span className="text-foreground">Location:</span>{" "}
          {personalInfo.location}
        </AnimatedItem>
        <AnimatedItem>
          <span className="text-foreground">GitHub:</span>{" "}
          <a
            href={personalInfo.github}
            className="text-foreground hover:underline"
            target="_blank"
          >
            {personalInfo.github}
          </a>
        </AnimatedItem>
        <AnimatedItem>
          <span className="text-foreground">LinkedIn:</span>{" "}
          <a
            href={personalInfo.linkedin}
            className="text-foreground hover:underline"
            target="_blank"
          >
            {personalInfo.linkedin}
          </a>
        </AnimatedItem>
      </AnimatedTerminalOutput>
    ),
  },

  projects: {
    name: "projects",
    description: "View my projects",
    usage: "projects [project-name]",
    execute: (args) => {
      if (args.length > 0) {
        const projectName = args.join(" ").toLowerCase();
        const project = projects.find((p) =>
          p.name.toLowerCase().includes(projectName)
        );
        if (project) {
          return createProjectCard(project);
        }
        return (
          <AnimatedTerminalOutput>
            <AnimatedItem className="text-destructive text-xs">
              ✕ Project "{args.join(" ")}" not found.
            </AnimatedItem>
          </AnimatedTerminalOutput>
        );
      }

      return (
        <AnimatedTerminalOutput className="space-y-4 ml-4.5 text-xs">
          {projects.map(createProjectCard)}
        </AnimatedTerminalOutput>
      );
    },
  },

  skills: {
    name: "skills",
    description: "Display my technical skills",
    execute: () => (
      <AnimatedTerminalOutput className="space-y-2 text-xs">
        <AnimatedItem className="ml-4.5 text-muted-foreground font-medium mb-4">
          Technical Skills:
        </AnimatedItem>
        {Object.entries(skills).map(([category, list], index) => (
          <AnimatedItem key={category} className="space-y-2">
            <p className="text-foreground font-semibold capitalize">
              <span className="text-sm">{index + 1}</span>{" "}
              {category.replace(/([A-Z])/g, " $1").trim()}:
            </p>
            <div className="flex flex-wrap gap-2 ml-4.5">
              {list.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="text-xs rounded"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </AnimatedItem>
        ))}
      </AnimatedTerminalOutput>
    ),
  },

  clear: {
    name: "clear",
    description: "Clear the terminal screen",
    execute: () => null,
  },

  date: {
    name: "date",
    description: "Display current date and time",
    execute: () => {
      const now = new Date();
      const formatted = format(now, "eeee, MMMM d, yyyy hh:mm a", {
        locale: enUS,
      });
      return (
        <AnimatedTerminalOutput>
          <AnimatedItem className="text-xs ml-4.5 text-muted-foreground">
            {formatted}
          </AnimatedItem>
        </AnimatedTerminalOutput>
      );
    },
  },

  cat: {
    name: "cat",
    description: "Display file contents",
    usage: "cat [filename]",
    execute: (args) => {
      if (args.length === 0) {
        return (
          <AnimatedTerminalOutput>
            <AnimatedItem className="text-destructive text-xs">
              ✕ cat: missing file operand
            </AnimatedItem>
          </AnimatedTerminalOutput>
        );
      }

      const filename = args[0].toLowerCase();

      switch (filename) {
        case "readme.md":
          return (
            <AnimatedTerminalOutput className="ml-4.5 space-y-2">
              {[
                `# ${personalInfo.name}'s Portfolio`,
                "",
                "Welcome to my terminal-based portfolio!",
                "",
                "## Available Commands",
                "- help: Show all available commands",
                "- whoami: Learn about me",
                "- projects: View my projects",
                "- experience: See my work history",
                "- skills: Check out my technical skills",
                "",
                "Type 'help' to see all available commands.",
              ].map((line, idx) => (
                <AnimatedItem
                  key={idx}
                  className="text-muted-foreground whitespace-pre-wrap text-xs"
                >
                  {line}
                </AnimatedItem>
              ))}
            </AnimatedTerminalOutput>
          );

        case "skills.txt":
          return (
            <AnimatedTerminalOutput className="ml-4.5 space-y-4">
              {Object.entries(skills).map(([category, list]) => (
                <AnimatedItem key={category} className="space-y-1 text-xs">
                  <p className="text-foreground font-semibold">
                    {category.toUpperCase()}:
                  </p>
                  <p className="text-muted-foreground">{list.join(", ")}</p>
                </AnimatedItem>
              ))}
            </AnimatedTerminalOutput>
          );

        default:
          return (
            <AnimatedTerminalOutput className="space-y-2 text-xs">
              <AnimatedItem className="text-destructive">
                ✕ cat: {filename}: No such file or directory.
              </AnimatedItem>
              <AnimatedItem className="ml-4.5 text-muted-foreground">
                Available Files: 'readme.md', 'skills.txt'.
              </AnimatedItem>
            </AnimatedTerminalOutput>
          );
      }
    },
  },

  theme: {
    name: "theme",
    description: "Change the terminal theme",
    usage: "theme [dark|light|toggle]",
    execute: (args) => {
      let nextTheme = "toggle";

      if (args.length > 0) {
        const arg = args[0].toLowerCase();
        if (["dark", "light", "toggle"].includes(arg)) {
          nextTheme = arg;
        } else {
          return (
            <AnimatedTerminalOutput className="space-y-2">
              <AnimatedItem className="text-destructive text-xs">
                ✕ Invalid argument: "{args[0]}"
              </AnimatedItem>
              <AnimatedItem className="text-xs ml-4.5 text-muted-foreground">
                Usage: theme [dark | light | toggle]
              </AnimatedItem>
            </AnimatedTerminalOutput>
          );
        }
      }

      const root = document.documentElement;
      const isDark = root.classList.contains("dark");

      if (nextTheme === "toggle") {
        root.classList.toggle("dark");
      } else if (nextTheme === "dark") {
        root.classList.add("dark");
      } else if (nextTheme === "light") {
        root.classList.remove("dark");
      }

      const current = root.classList.contains("dark") ? "dark" : "light";

      return (
        <AnimatedTerminalOutput>
          <AnimatedItem className="text-xs ml-4.5 text-muted-foreground">
            Theme set to{" "}
            <span className="text-foreground font-medium">{current}</span>.
          </AnimatedItem>
        </AnimatedTerminalOutput>
      );
    },
  },
};

// Updated Prompt component with consistent animation
export const Prompt = ({
  prompt,
  command,
}: {
  prompt: string;
  command: string;
}) => (
  <AnimatedTerminalOutput className="ml-4.5 text-xs">
    <AnimatedItem className="text-rose-500 font-medium">
      {prompt} <span className="text-foreground font-normal">{command}</span>
    </AnimatedItem>
  </AnimatedTerminalOutput>
);
