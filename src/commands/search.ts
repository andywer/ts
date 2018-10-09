import axios from "axios"
import * as figures from "figures"
import { CLI } from "./_types"

export const help = `
Usage
  $ ts search <package-name>

Arguments
  Pass any package name to look for type declarations published to npm.
  Will scan for "@types/<package-name>" and "@*/types-<package-name>" packages.

Options
  --help                Print this help.
`

interface Result {
  name: string[],
  rating: number[]
}

async function fetchTypePackageNames (partialPackageName: string) {
  const response = await axios.get(`http://npmsearch.com/query?q=name:(${encodeURIComponent(`types AND ${partialPackageName}*`)})&fields=name,rating&sort=rating:desc`)
  const results: Result[] = response.data.results
  return results
}

function filterResults (results: Result[]): Result[] {
  return results.filter(
    result => result.name[0].startsWith("@types/") || result.name[0].match(/^@[^\/]+\/types-/)
  )
}

function getTypePackageBaseName (packageName: string) {
  return packageName.replace(/^@types\//, "").replace(/^@[^\/]+\/types-/, "")
}

function sortResults (results: Result[], packageName: string): Result[] {
  const customTypesPackageNames = results.filter(result => !result.name[0].startsWith("@types/"))
  const defTypedPackageNames = results.filter(result => result.name[0].startsWith("@types/"))

  const sorter = (result1: Result, result2: Result) => {
    const baseName1 = getTypePackageBaseName(result1.name[0])
    const baseName2 = getTypePackageBaseName(result2.name[0])

    if (baseName2.startsWith(packageName) && !baseName1.startsWith(packageName)) {
      return 1
    } else if (baseName2.length < baseName1.length) {
      return 1
    } else {
      return -1
    }
  }

  return [
    ...defTypedPackageNames.sort(sorter),
    ...customTypesPackageNames.sort(sorter)
  ]
}

export async function run (cli: CLI) {
  if (cli.input.length !== 1) {
    console.error(help)
    process.exit(1)
  }

  const [ packageName ] = cli.input
  const results = await fetchTypePackageNames(packageName)

  if (results.length === 0) {
    console.log(`${figures.cross} No matches`)
  } else {
    const preparedResults = sortResults(filterResults(results), packageName)
    console.log("Type declaration packages:\n")

    for (const result of preparedResults) {
      console.log(`  ${result.name[0]}`)
    }
  }
}
