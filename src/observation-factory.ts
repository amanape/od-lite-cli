import { Topic, type Observation } from "od-lite";

export class ObservationFactory {
  static fromTerminalOutput(input: string, output: string): Observation {
    const data = { input, output };
    return { type: Topic.OBSERVATION, data };
  }
}
