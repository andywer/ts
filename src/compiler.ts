import typescript from "typescript"

export function compileOnce (filePaths: string[], compilerOptions: typescript.CompilerOptions) {
  const program = typescript.createProgram(filePaths, { ...compilerOptions, noEmit: false, noEmitOnError: true })
  const result = program.emit()

  const diagnostics = typescript.getPreEmitDiagnostics(program).concat(result.diagnostics)
  return {
    diagnostics,
    result
  }
}
