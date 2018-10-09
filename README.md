# ts

The CLI that TypeScript deserves.


## Installation

Locally:

```sh
$ npm install --save-dev ts
```

Globally:

```sh
$ npm install --global ts
```


## Quick start

Run the TypeScript compiler with `ts` default best practice options:

```sh
npx ts --out-dir <path> <...entrypoint files>
```

Compiling using `ts` does not require a `tsconfig.json` file, but `ts` will act according to its options if found.

If your source files are in `src/` and you want to write the output files to `dist/`, you don't even need to set anything:

```sh
npx ts
```

Run with `--emit-tsconfig` to create a `tsconfig.json` file.

```sh
npm ts --emit-tsconfig
```
```sh
npm ts --declaration --emit-tsconfig --target es2016
```


## Usage

```
Usage
  General usage
  $ ts <command> [<...options>]

  Compile project in current directory
  $ ts [build]

  Compile with altered options
  $ ts --target es2018 src/**/*.ts

  Create tsconfig.json
  $ ts --declaration --emit-tsconfig

  Show this help text
  $ ts --help

Commands
  build                 Compile a TypeScript project. Default command.
  compile               Alias of "build".
  search                Search for a type declarations package on npm.

General options
  --help                Print this help.
  --version             Print version.

See <https://github.com/andywer/ts> for details.
```


## Monorepo support

Run `ts` with `--monorepo` or set the `monorepo` option in the `package.json` file (see below).

This will make `ts` look for packages not only in `./node_modules/`, but also in `../../node_modules/` (the monorepo root directory's `node_modules`). It will also look for type declaration packages and custom local type declarations in the monorepo root.


## Custom type package support

By default `ts` will look for type declaration packages not only in `node_modules/@types/*`, but also in `node_modules/@*/types-*`.

That allows you to easily publish your custom type declarations to npm under the scope of your npm user name without going through all the overhead of Definitely Typed.

Use the `ts search` command to find type declaration packages on npm:

```sh
$ ts search koa
# Will list all packages matching "@types/*" or "@*/types-*", and "koa"
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

You can also set all `ts` options and TypeScript `compilerOptions` in your `package.json`:

```ts
{
  "typescript": {
    "compilerOptions": {
      /* Any compiler options */
    },
    "include": [
      /* Source files (entrypoints) */
    ],
    "monorepo": boolean,
    "typingsDirectory": "./typings"
  }
}
```

**Experimental:** Allows you to `.gitignore` your `tsconfig.json` file altogether.


## License

MIT
