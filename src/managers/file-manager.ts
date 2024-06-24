export class FileManager {
  public async read(path: string): Promise<string> {
    const file = Bun.file(path);
    return await file.text();
  }
}
