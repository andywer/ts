export type Options = Partial<ReturnType<typeof getOptions>>

export function getOptions (cliFlags: any, packageJsonData: any) {
  const packageJsonConfig = packageJsonData.ts || {}

  if (packageJsonConfig.include && !Array.isArray(packageJsonConfig.include)) {
    throw new Error("Expected 'ts.include' in package.json file to be an array.")
  }

  const emitTSConfig = Boolean(cliFlags.emitTsconfig || (packageJsonConfig.emit && packageJsonConfig.emit.tsconfig))
  const include = packageJsonConfig.include || undefined
  const monorepo = cliFlags.monorepo || packageJsonConfig.monorepo

  return {
    emitTSConfig,
    include,
    monorepo
  }
}
