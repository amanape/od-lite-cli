import type { ObservationEvent } from "od-lite";

export interface CommandObservation extends ObservationEvent {
  data: {
    type: 'cmd';
    output: string;
  }
}

export type TerminalObservation = CommandObservation;
