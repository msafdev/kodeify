export interface CommandOutput {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: Date;
}

export interface Command {
  name: string;
  description: string;
  usage?: string;
  execute: (args: string[]) => React.ReactNode;
}
