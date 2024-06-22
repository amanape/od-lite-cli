import { ObservationFactory, type Runtime, type TerminalManager } from "od-lite";
import TogetherAgent from "./agent";
import TM from "./tm";
import type { Action } from "od-lite/dist/types/actions";
import type { Observation } from "od-lite/dist/types/observations";

class BasicRuntime implements Runtime {
  constructor(private readonly terminalManager: TerminalManager) { }

  public async handle(action: Action): Promise<Observation> {
    const output = await this.terminalManager.write(action.command);
    return ObservationFactory.fromTerminalOutput(action.command, output);
  }
}

const runtime = new BasicRuntime(new TM());
const agent = new TogetherAgent();

const action = await agent.query("Check all active network connections.");
console.log('Action:', action);

const observation = await runtime.handle(action);
console.log('Observation:', observation);
