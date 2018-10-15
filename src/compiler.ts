import * as path from "path"
import typescript from "typescript"
import { Options } from "./options"

type Transformation = (options?: any, program?: typescript.Program) => typescript.TransformerFactory<typescript.SourceFile>

function loadCustomTransformations (options: Options) {
  if (!options.transformations) {
    return []
  }

  return options.transformations.map((modulePath: string) => {
    const module: any = modulePath.match(/^\.\.?\//)
      ? require(path.join(process.cwd(), modulePath))
      : require(modulePath)
    const transformer: Transformation = module && module.default ? module.default : module
    return transformer
  })
}

export function compileOnce (filePaths: string[], compilerOptions: typescript.CompilerOptions, options: Options) {
  const customTransformations = loadCustomTransformations(options)
  const program = typescript.createProgram(filePaths, { ...compilerOptions, noEmit: false, noEmitOnError: true })

  const transformations: typescript.CustomTransformers = {
    before: customTransformations.map(transformation => transformation({}, program))
  }
  const result = program.emit(undefined, undefined, undefined, undefined, transformations)

  const diagnostics = typescript.getPreEmitDiagnostics(program).concat(result.diagnostics)
  return {
    diagnostics,
    result
  }
}
