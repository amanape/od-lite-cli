class BunTerminalManager {
  public static readonly version = "0.0.1";

  static async run(command: string): Promise<string> {
    try {
      const proc = Bun.spawn(command.split(" "));
      return Bun.readableStreamToText(proc.stdout);
    } catch (e) {
      if (e instanceof Error) return e.message;
      else return String(e);
    }
  }
}

export default BunTerminalManager;
