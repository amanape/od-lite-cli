class BunTerminalManager {
  public static readonly version = "0.0.2";

  static async run(command: string): Promise<string> {
    const proc = Bun.spawn(command.split(" "), {
      stderr: "pipe",
    });

    const error = (await Bun.readableStreamToText(proc.stderr)).trim();
    const output = (await Bun.readableStreamToText(proc.stdout)).trim();

    if (error) throw new Error(error);
    return output;
  }
}

export default BunTerminalManager;
