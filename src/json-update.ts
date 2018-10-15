import * as fs from "fs"
import createUpdater from "jsonfile-updater"

const readFile = (filePath: string, encoding = "utf8") => new Promise<string>(
  (resolve, reject) => fs.readFile(filePath, encoding, (err, content) => err ? reject(err) : resolve(content))
)
const stat = (filePath: string) => new Promise<fs.Stats>(
  (resolve, reject) => fs.stat(filePath, (error, stats) => error ? reject(error) : resolve(stats))
)
const writeFile = (filePath: string, content: string, encoding = "utf8") => new Promise<void>(
  (resolve, reject) => fs.writeFile(filePath, content, encoding, (err) => err ? reject(err) : resolve())
)

async function readJsonFile (filePath: string) {
  const content = await readFile(filePath)
  try {
    return JSON.parse(content)
  } catch (error) {
    throw new Error(`Parsing JSON file ${filePath} failed: ${error.message}`)
  }
}

export async function createOrUpdateJSON (filePath: string, jsonData: any) {
  try {
    await stat(filePath)
  } catch (error) {
    await writeFile(filePath, JSON.stringify(jsonData, null, 2))
    return true
  }

  const updater = createUpdater(filePath)
  const prevData = await readJsonFile(filePath)

  await Promise.all(
    Object.keys(jsonData).filter(key => typeof jsonData[key] !== "undefined").map(async key => {
      try {
        if (prevData[key]) {
          await updater.set(key, jsonData[key])
        } else {
          await updater.add(key, jsonData[key])
        }
      } catch (error) {
        throw new Error(`Updating JSON file ${filePath}, key "${key}" failed: ${error.message}`)
      }
    })
  )
  return false
}
