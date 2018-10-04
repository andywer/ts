import findPackageJson, { IteratorNext } from "find-package-json"
import * as fs from "fs"
import * as path from "path"
import typescript from "typescript"

const readFile = (filePath: string, encoding = "utf8") => new Promise<string>(
  (resolve, reject) => fs.readFile(filePath, encoding, (err, content) => err ? reject(err) : resolve(content))
)

export function locatePackageJson (dirPath?: string) {
  const iterator = findPackageJson(dirPath)
  const next = iterator.next()
  return next.done ? null : (next as IteratorNext).filename
}

export function locateTSConfigJson (dirPath: string = typescript.sys.getCurrentDirectory()) {
  return typescript.findConfigFile(dirPath, typescript.sys.fileExists) || null
}

export async function readJsonFile (filePath: string) {
  const jsonString = await readFile(filePath)
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    throw new Error(`Parsing ${path.basename(filePath)} failed: ${error.message}`)
  }
}
