import { Topic } from "od-lite";
import type { Observation } from "../types/observations";

export class ObservationFactory {
  static fromTerminalOutput(command: string, output: string): Observation {
    const data = { command, output };
    return { type: Topic.OBSERVATION, data };
  }

  static fromReadFile(path: string, output: string): Observation {
    const data = { path, output };
    return { type: Topic.OBSERVATION, data };
  }
}
