import type { ObservationEvent } from "od-lite";


interface CommandObservation extends ObservationEvent {
  data: {
    command: string;
    output: string;
  }
}

interface ReadFileObservation extends ObservationEvent {
  data: {
    path: string;
    output: string;
  }
}

export const isCommandObservation = (observation: Observation): observation is CommandObservation => 'command' in observation.data;

export type Observation = CommandObservation | ReadFileObservation;
