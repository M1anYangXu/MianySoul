declare module "adm-zip" {
  interface ZipEntry {
    entryName: string;
    getData(): Buffer;
    getDataAsync(callback: (data: Buffer) => void): void;
    isDirectory: boolean;
    header: any;
  }

  export default class AdmZip {
    constructor(input?: string | Buffer);
    addLocalFile(localPath: string, zipPath?: string, rename?: string): void;
    addLocalFolder(localPath: string, zipPath?: string): void;
    addFile(entryName: string, content: string | Buffer, comment?: string): void;
    getEntries(): ZipEntry[];
    getEntry(entryName: string): ZipEntry | null;
    readFile(entryName: string): Buffer | null;
    readFileAsync(entryName: string, callback: (data: Buffer | null) => void): void;
    extractEntryTo(
      entryName: string,
      targetPath: string,
      maintainEntryPath?: boolean,
      overwrite?: boolean
    ): boolean;
    extractAllTo(targetPath: string, overwrite?: boolean): void;
    extractAllToAsync(targetPath: string, overwrite?: boolean): Promise<void>;
    toBuffer(): Buffer;
    writeZip(targetFileName?: string): void;
    deleteFile(entryName: string): void;
    test(): boolean;
  }
}
