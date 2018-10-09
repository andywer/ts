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

function sortResults (results: Result[]): Result[] {
  return [
    ...results.filter(result => result.name[0].startsWith("@types/")),
    ...results.filter(result => !result.name[0].startsWith("@types/"))
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
    console.log("Type declaration packages:\n")

    for (const result of sortResults(results)) {
      console.log(`  ${result.name[0]}`)
    }
  }
}
