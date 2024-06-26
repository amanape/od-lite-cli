import type { ObservationEvent } from "od-lite";

export interface CommandObservation extends ObservationEvent {
  data: {
    type: 'cmd';
    output: string;
    error?: boolean;
  }
}

export type TerminalObservation = CommandObservation;
