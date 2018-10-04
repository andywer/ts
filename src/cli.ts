#!/usr/bin/env node

import meow from "meow"
import typescript from "typescript"
import { compileOnce } from "./compiler"
import { createOrUpdateJSON } from "./json-update"
import { getOptions } from "./options"
import { locatePackageJson, locateTSConfigJson, readJsonFile } from "./json-files"
import { getAlwaysIncludeGlobs, getSourceGlobs, resolveGlobs } from "./sources"
import { getCompilerOptions, getIncludes, parseCompilerOptions } from "./tsconfig"

const helpText = `
Usage
  $ ts --out-dir <path> <...entrypoint files>
  $ ts [--declaration] [--emit-tsconfig] [--lint] [--out-dir <path>] [<...entrypoint files>]

Arguments
  Pass any glob pattern(s) of the files to compile, like 'src/**/*.ts' or '!src/**/*.test.(ts|tsx)'.
  You only need to pass the entrypoints of your program.

Options
  --declaration         Create declaration files (*.d.ts) in output directory. Defaults to true.
  --emit-tsconfig       Create/update tsconfig.json file.
  --emit-tslint         Create/update tslint.json file.
  --help                Print this help.
  --jsx <option>        Enable JSX support in TSX files. Set to "react", "react-native" or "preserve".
  --lib <...lib>        Set features available at runtime: ES5, ES2015, ..., DOM, WebWorker, ...
  --monorepo            Indicates a monorepo package. Will look for types in package and monorepo root.
  --no-strict           Disable strict mode.
  --out-dir, -o <path>  Set the output directory. Defaults to dist/.
  --out-module <type>   Set the output module type: "commonjs" (default), "es2015", "umd", ...
  --skip-lib-check      Don't type-check declaration files (*.d.ts).
  --source-maps         Create source maps.
  --target, -t <target> Set target: ES5, ES2015, ..., ESNext
  --typings-dir <path>  Set the custom 3rd-party module declaration directory. Defaults to "typings/".
  --version             Print version.

Almost all options can be set in the package.json file, so you don't need to pass them on invocation.

See <https://github.com/andywer/ts> for CLI details.
See <https://www.typescriptlang.org/docs/handbook/compiler-options.html> for compiler options details.
`

const cli = meow(helpText, {
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

if (cli.flags.help) {
  cli.showHelp()
  process.exit(0)
} else if (cli.flags.version) {
  cli.showVersion()
  process.exit(0)
}

const formatHost: typescript.FormatDiagnosticsHost = {
  getCanonicalFileName: path => path,
  getCurrentDirectory: typescript.sys.getCurrentDirectory,
  getNewLine: () => typescript.sys.newLine
}

function fail (message: string): never {
  console.error(message)
  return process.exit(1)
}

async function run () {
  const packageJsonData = await readJsonFile(locatePackageJson() || fail("Could not locate package.json file."))
  const tsconfigJsonPath = locateTSConfigJson()
  const tsconfigJsonData = tsconfigJsonPath ? await readJsonFile(tsconfigJsonPath) : {}

  const options = getOptions(cli.flags, packageJsonData, tsconfigJsonData)
  const compilerOptionsJson = getCompilerOptions(cli.flags, options, packageJsonData, tsconfigJsonData)
  const compilerOptions = parseCompilerOptions(compilerOptionsJson)

  if (options.emitTSConfig) {
    await createOrUpdateJSON("tsconfig.json", {
      compilerOptions: compilerOptionsJson,
      include: getIncludes(cli.input, options)
    })
  }

  const globs = getSourceGlobs(cli.input, options).concat(getAlwaysIncludeGlobs(options))
  const filePaths = await resolveGlobs(globs)

  if (filePaths.length === 0) {
    fail(`No matching source files found: ${globs.join(", ")}`)
  }

  // TODO: Support watch mode
  const startingTime = Date.now()
  const { diagnostics, result } = compileOnce(filePaths, compilerOptions)

  if (result.emitSkipped) {
    console.error("Build failed:")
    console.error(typescript.formatDiagnostics(diagnostics, formatHost))
    process.exit(1)
  } else {
    console.log(typescript.formatDiagnostics(diagnostics, formatHost))
    console.log(`Compiled in ${((Date.now() - startingTime) / 1000).toFixed(1)}s`)
  }
}

run()
.catch(error => {
  console.error(error)
  process.exit(1)
})
