export type Options = Partial<ReturnType<typeof getOptions>>

function toArray<T> (thing: T | T[] | undefined): T[] {
  if (!thing) {
    return []
  } else if (Array.isArray(thing)) {
    return thing
  } else {
    return [ thing ]
  }
}

export function getOptions (cliFlags: any, packageJsonData: any, tsconfigJsonData: any) {
  const packageJsonConfig = packageJsonData.ts || {}

  if (packageJsonConfig.include && !Array.isArray(packageJsonConfig.include)) {
    throw new Error("Expected 'ts.include' in package.json file to be an array.")
  }
  if (tsconfigJsonData.include && !Array.isArray(tsconfigJsonData.include)) {
    throw new Error("Expected 'include' in tsconfig.json file to be an array.")
  }

  const emitTSConfig = Boolean(cliFlags.emitTsconfig || (packageJsonConfig.emit && packageJsonConfig.emit.tsconfig))
  const include = packageJsonConfig.include || tsconfigJsonData.include || undefined
  const monorepo = cliFlags.monorepo || packageJsonConfig.monorepo
  const transformations = cliFlags.transform ? toArray(cliFlags.transform) : packageJsonConfig.transforms as string[] || []
  const typingsDirectory = cliFlags.typingsDir || packageJsonConfig.typingsDirectory || "./typings"

  return {
    emitTSConfig,
    include,
    monorepo,
    transformations,
    typingsDirectory
  }
}
