class BunFileManager {
  public static readonly version = "0.0.1";

  static async read(path: string): Promise<string> {
    const file = Bun.file(path);
    return file.text();
  }

  static async create(path: string, content?: string): Promise<string> {
    const file = Bun.file(path);
    const bytes = await Bun.write(file, content || '');
    return `File created: ${path} (${bytes} bytes)`;
  }

  static async update(path: string, content: string): Promise<string> {
    const file = Bun.file(path);
    await Bun.write(file, content);
    return BunFileManager.read(path);
  }
}

export default BunFileManager;
