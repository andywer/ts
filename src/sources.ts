import globByCallback from "glob"
import { Options } from "./options"

const defaultSourceGlobs = [
  "src/**/*.ts",
  "src/**/*.tsx"
]

const dedupe = <T>(array: T[]): T[] => Array.from(new Set(array))

const glob = (pattern: string) => new Promise<string[]>(
  (resolve, reject) => globByCallback(pattern, (error, result) => error ? reject(error): resolve(result))
)

export function getSourceGlobs (cliArguments: string[], options: Options = {}) {
  if (cliArguments.length > 0) {
    return cliArguments
  } else if (options.include) {
    return options.include
  }

  return defaultSourceGlobs
}

export async function resolveGlobs (globs: string[]) {
  let filePaths: string[] = []
  for (const pattern of globs) {
    const pathsMatchingPattern = await glob(pattern)
    filePaths = [ ...filePaths, ...pathsMatchingPattern ]
  }
  return dedupe(filePaths)
}
