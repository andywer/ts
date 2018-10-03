declare module "find-package-json" {
  type IteratorNext = {
    done: false,
    filename: string,
    value: any | false
  }

  interface Iterator {
    next(): IteratorNext | { done: false }
  }

  function findPackageJson(dirPath?: string): Iterator

  export default findPackageJson
  export {
    IteratorNext
  }
}
