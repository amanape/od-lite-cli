export class TerminalManager {
  public async write(command: string): Promise<string> {
    const proc = Bun.spawn(command.split(" "));
    return new Response(proc.stdout).text();
  }
}
