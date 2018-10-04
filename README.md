# ts - The CLI that TypeScript deserves

Putting an end to complicated setups and inconvenient idiosyncrasies. Start your next TypeScript project with a smile on your face, not by copy-and-pasting `ts*.json` files.


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

Many people prefer not to have several configuration files in their repository root. You can put custom compiler options and linting configuration in the `package.json` file (see **Configuration in `package.json`**), set the `emit` options to `true` and add the `ts*.json` files to your `.gitignore` - Done!


## Usage

```
Usage
  $ ts --out-dir <path> <...entrypoint files>
  $ ts [--declaration] [--emit-tsconfig] [--lint] [--out-dir <path>] [<...entrypoint files>]

Arguments
  Pass any glob pattern(s) of the files to compile, like 'src/**/*.ts' or '!src/**/*.test.(ts|tsx)'.
  You only need to pass the entrypoints of your program.

Options
  --declaration         Create declaration files (*.d.ts) in output directory. Defaults to true.
  --emit-tsconfig       Create/update tsconfig.json file.
  --emit-tslint         Create/update tslint.json file.
  --help                Print this help.
  --jsx <option>        Enable JSX support in TSX files. Set to "react", "react-native" or "preserve".
  --lib <...lib>        Set features available at runtime: ES5, ES2015, ..., DOM, WebWorker, ...
  --monorepo            Indicates a monorepo package. Will look for types in package and monorepo root.
  --no-strict           Disable strict mode.
  --out-dir, -o <path>  Set the output directory. Defaults to dist/.
  --out-module <type>   Set the output module type: "commonjs" (default), "es2015", "umd", ...
  --skip-lib-check      Don't type-check declaration files (*.d.ts).
  --source-maps         Create source maps.
  --target, -t <target> Set target: ES5, ES2015, ..., ESNext
  --typings-dir <path>  Set the custom 3rd-party module declaration directory. Defaults to "typings/".
  --version             Print version.

Almost all options can be set in the package.json file, so you don't need to pass them on invocation.

See <https://github.com/andywer/ts> for CLI details.
See <https://www.typescriptlang.org/docs/handbook/compiler-options.html> for compiler options details.
```


## Defaults

In contrast to `tsc` behavior, `ts` lets you override options set in the `package.json` or `tsconfig.json` selectively using command line arguments. Yes, you heard right, `tsc` will ignore your `tsconfig.json` once you set a single option via command line 🤦‍

This is a `tsconfig.json` that resembles the default options:

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "lib": ["es2015"],
    "module": "commonjs",
    "moduleResolution": "node",
    "newLine": "lf",
    "target": "es5",
    "outDir": "<output directory>",
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
      "tsconfig": boolean
    },
    "include": [
      /* Source files (entrypoints) */
    ],
    "typingsDirectory": "./typings"
  }
}
```


## License

MIT
