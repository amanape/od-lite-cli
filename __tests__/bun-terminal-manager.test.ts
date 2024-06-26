import { describe, it, expect } from "bun:test";
import BunTerminalManager from "../src/bun-terminal-manager";

describe('BunTerminalManager', () => {
  it('should run a terminal command and return stdout', async () => {
    const result = await BunTerminalManager.run('echo "Hello, World!"');
    expect(result).toBe('\"Hello, World!\"\n');
  });

  it('should run a terminal command and return stderr', async () => {
    const result = await BunTerminalManager.run('p d f');
    expect(result).toBe('Executable not found in $PATH: \"p\"');
  });
});
