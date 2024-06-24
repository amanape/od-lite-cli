import type { Runtime } from "od-lite";
import type { TerminalManager } from "./managers/terminal-manager";
import { ObservationFactory } from "./utils/observation-factory";
import { isCommandAction, type Action } from "./types/actions";
import type { Observation } from "./types/observations";
import type { FileManager } from "./managers/file-manager";

export class BasicRuntime implements Runtime<Action, Observation> {
  constructor(
    private readonly terminalManager: TerminalManager,
    private readonly fileManager: FileManager,
  ) { }

  public async handle(action: Action): Promise<Observation> {
    if (isCommandAction(action)) {
      const output = await this.terminalManager.write(action.data.command);
      return ObservationFactory.fromTerminalOutput(action.data.command, output);
    } else {
      const contents = await this.fileManager.read(action.data.path);
      return ObservationFactory.fromReadFile(action.data.path, contents);
    }
  }
}
