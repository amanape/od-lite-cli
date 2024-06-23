import { ObservationFactory, type Observation, type Runtime, type TerminalManager } from "od-lite";
import type { Action } from "od-lite/dist/types/actions";

export class BasicRuntime implements Runtime {
  constructor(private readonly terminalManager: TerminalManager) { }

  public async handle(action: Action): Promise<Observation> {
    const output = await this.terminalManager.write(action.data.command);
    return ObservationFactory.fromTerminalOutput(action.data.command, output);
  }
}
