import * as path from "path"
import typescript from "typescript"
import { compileOnce } from "../compiler"
import { locatePackageJson, locateTSConfigJson, readJsonFile } from "../json-files"
import { createOrUpdateJSON } from "../json-update"
import { getOptions } from "../options"
import { getAlwaysIncludeGlobs, getSourceGlobs, resolveGlobs } from "../sources"
import { getCompilerOptions, getIncludes, parseCompilerOptions } from "../tsconfig"
import { CLI } from "./_types"

export const help = `
Usage
  $ ts
  $ ts [build] --out-dir <path> <...entrypoint files>
  $ ts [build] [--declaration] [--emit-tsconfig] [--lint] [--out-dir <path>] [<...entrypoint files>]

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
  --root-dir <path>     Set the source directory. Used to
  --skip-lib-check      Don't type-check declaration files (*.d.ts).
  --source-maps         Create source maps.
  --target, -t <target> Set target: ES5, ES2015, ..., ESNext
  --transform <module>  Enable custom TypeScript transformation. Pass a package name or relative module path.
  --typings-dir <path>  Set the custom 3rd-party module declaration directory. Defaults to "typings/".

TS options and compiler options can be set in the package.json file, too.

See <https://github.com/andywer/ts> for CLI details.
See <https://www.typescriptlang.org/docs/handbook/compiler-options.html> for compiler options details.
`

const dedupe = <T>(array: T[]): T[] => Array.from(new Set(array))

const formatHost: typescript.FormatDiagnosticsHost = {
  getCanonicalFileName: filePath => filePath,
  getCurrentDirectory: typescript.sys.getCurrentDirectory,
  getNewLine: () => typescript.sys.newLine
}

function fail (message: string): never {
  console.error(message)
  return process.exit(1)
}

function filePathIsIn (filePath: string, dirPath: string) {
  return path.resolve(filePath).startsWith(path.resolve(dirPath))
}

export async function run (cli: CLI) {
  const packageJsonData = await readJsonFile(locatePackageJson() || fail("Could not locate package.json file."))
  const tsconfigJsonPath = locateTSConfigJson()
  const tsconfigJsonData = tsconfigJsonPath ? await readJsonFile(tsconfigJsonPath) : {}

  const options = getOptions(cli.flags, packageJsonData, tsconfigJsonData)
  const compilerOptionsJson = getCompilerOptions(cli.flags, options, packageJsonData, tsconfigJsonData)
  const compilerOptions = parseCompilerOptions(compilerOptionsJson)

  if (options.emitTSConfig) {
    const tsConfigCreated = await createOrUpdateJSON("tsconfig.json", {
      compilerOptions: compilerOptionsJson,
      include: getIncludes(cli.input, options)
    })
    if (tsConfigCreated) {
      console.log("Created tsconfig.json file.")
    }
  }

  const sourceGlobs = dedupe([
    ...getSourceGlobs(cli.input, options),
    ...(options.include || [])
  ])
  const allInputGlobs = dedupe([
    ...getAlwaysIncludeGlobs(options),
    ...sourceGlobs
  ])

  const allInputFilePaths = await resolveGlobs(allInputGlobs)
  const sourceFilePaths = await resolveGlobs(sourceGlobs)

  if (sourceFilePaths.length === 0) {
    fail(`No matching source files found: ${sourceGlobs.join(", ")}`)
  }
  if (compilerOptions.rootDir && sourceFilePaths.some(filePath => !filePathIsIn(filePath, compilerOptions.rootDir as string))) {
    console.error(`Warning: Some source files are not located within the specified source root directory (${compilerOptions.rootDir}). Disabling the source root directory compiler option.`)
    compilerOptions.rootDir = undefined
  }

  const startingTime = Date.now()
  const { diagnostics, result } = compileOnce(allInputFilePaths, compilerOptions, options)
  // TODO: Support watch mode

  if (result.emitSkipped) {
    console.error("Build failed:")
    console.error(typescript.formatDiagnosticsWithColorAndContext(diagnostics, formatHost))
    process.exit(1)
  } else {
    console.log(typescript.formatDiagnosticsWithColorAndContext(diagnostics, formatHost))
    console.log(`Compiled in ${((Date.now() - startingTime) / 1000).toFixed(1)}s`)
  }
}
