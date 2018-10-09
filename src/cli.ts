#!/usr/bin/env node

import meow from "meow"
import { Commands } from "./commands/_types"
import * as commands from "./commands/index"

const helpText = `
Usage
  General usage
  $ ts <command> [<...options>]

  Compile project in current directory
  $ ts [build]

  Compile with altered options
  $ ts --target es2018 src/**/*.ts

  Create tsconfig.json
  $ ts --emit-tsconfig [<...options>]

  Show this help text
  $ ts --help

Commands
  build                 Compile a TypeScript project. Default command.
  compile               Alias of "build".
  search                Search for a type declarations package on npm.

General options
  --help                Print this help.
  --version             Print version.

See <https://github.com/andywer/ts> for details.
`

const cli = meow(helpText, {
  autoHelp: false,
  flags: {
    "declaration": {
      type: "boolean"
    },
    "emit-tsconfig": {
      type: "boolean"
    },
    "emit-tslint": {
      type: "boolean"
    },
    "monorepo": {
      type: "boolean"
    },
    "no-strict": {
      type: "boolean"
    },
    "out-dir": {
      alias: "o"
    },
    "skip-lib-check": {
      type: "boolean"
    },
    "target": {
      alias: "t"
    },
    "watch": {
      alias: "w",
      type: "boolean"
    }
  }
})

const firstArgument = process.argv[2]
const commandName = firstArgument && firstArgument.match(/^[a-z]+$/) ? firstArgument : null

if (cli.input[0] === commandName) {
  cli.input.shift()
}

const command = (commands as Commands)[commandName ? commandName.toLowerCase() : "build"]

if (commandName && !command) {
  console.error(`Command not found: ${commandName.toLowerCase()}`)
  cli.showHelp()
  process.exit(1)
}

if (cli.flags.help) {
  if (commandName) {
    console.error(command.help)
  } else {
    cli.showHelp()
  }
  process.exit(0)
} else if (cli.flags.version) {
  cli.showVersion()
  process.exit(0)
}

command.run(cli).catch(error => {
  console.error(error)
  process.exit(1)
})
