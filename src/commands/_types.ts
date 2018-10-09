interface Flags {
  [flagName: string]: string | boolean
}

export interface CLI {
  flags: Flags,
  input: string[]
}

interface Command {
  help: string,
  run (cli: CLI): Promise<void>
}

export interface Commands {
  [commandName: string]: Command
}
