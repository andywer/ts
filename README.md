# ts - The CLI that TypeScript deserves

## Starting a new project

Run the TypeScript compiler with `ts` best practice options - no `tsconfig.json` needed!

```sh
npx ts --out-dir <path> <...entrypoint files>
```

"But now my IDE complains, even though ts compiles just fine" - No problem, we've got you covered.

Just emit the TypeScript configuration into a `tsconfig.json` file, so your IDE and other packages know what's going on.

```sh
npm ts --emit-tsconfig
```


## Usage

```
Usage
  $ ts --out-dir <path> <...entrypoint files>
  $ ts [--declaration] [--emit-tsconfig] [--lint] [--out-dir <path>] [<...entrypoint files>]

Options
  --declaration         Create declaration files (*.d.ts) in output directory. Defaults to true.
  --emit-tsconfig       Create/update tsconfig.json file.
  --emit-tslint         Create/update tslint.json file.
  --help                Print this help.
  --jsx <option>        Enable JSX support in TSX files. Set to "react" or "preserve".
  --lib <...lib>        Set features available at runtime: ES5, ES2015, ..., DOM, WebWorker, ...
  --lint                Run tslint. Uses configuration from package.json or tslint.json.
  --lint <...config>    Run tslint, <config> can be "latest" or a tslint-config-<config> package.
  --no-strict           Disable strict mode.
  --out-dir, -o <path>  Set the output directory. Defaults to dist/.
  --out-module <type>   Set the output module type: "commonjs" (default), "es2015", "umd", ...
  --target, -t <target> Set target: ES5, ES2015, ..., ESNext
  --watch, -w           Watch and re-run on file changes.
  --version             Print version.

  Almost all options can be set in the package.json file, so you don't need to set them all
  on invocation.

  See <https://github.com/andywer/ts> for CLI details.
  See <https://www.typescriptlang.org/docs/handbook/compiler-options.html> for compiler options details.
```


## Defaults

In contrast to `tsc` behavior, `ts` lets you override options set in the `package.json` or `tsconfig.json` selectively using command line arguments. Yes, you heard right, `tsc` will ignore your `tsconfig.json` once you set a single option via command line 🤦‍

This is a `tsconfig.json` that resembles the default options:

```json
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "lib": ["es2015"],
    "module": "commonjs",
    "moduleResolution": "node",
    "newLine": "lf",
    "target": "es5",
    "outDir": "<output directory>",
    "declaration": true,
    "strict": true
  },
  "include": [
    "<entrypoint file path>"
  ]
}
```


## Configuration in `package.json`

```ts
{
  "typescript": {
    "compilerOptions": {
      /* Any compiler options */
    },
    "emit": {
      "tsconfig": boolean,
      "tslint": boolean
    },
    "include": [
      /* Source files (entrypoints) */
    ],
    "tslint": {
      /* TSLint configuration */
    }
  }
}
```


## License

MIT
