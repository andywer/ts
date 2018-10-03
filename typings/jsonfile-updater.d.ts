declare module "jsonfile-updater" {
  type Callback = (error: Error) => void

  interface Updater {
    add(key: string, value: any): Promise<void>
    append(key: string, value: any): Promise<void>
    delete(key: string): Promise<void>
    delete(keys: string[]): Promise<void>
    set(key: string, value: any): Promise<void>
  }

  function createUpdater (filePath: string): Updater

  export = createUpdater
}
