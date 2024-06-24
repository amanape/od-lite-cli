import { ObservationFactory, type Action, type Observation, type Runtime } from "od-lite";
import type TerminalManager from "./terminal-manager";

export class BasicRuntime implements Runtime {
  constructor(private readonly terminalManager: TerminalManager) { }

  public async handle(action: Action): Promise<Observation> {
    const output = await this.terminalManager.write(action.data.command);
    return ObservationFactory.fromTerminalOutput(action.data.command, output);
  }
}
