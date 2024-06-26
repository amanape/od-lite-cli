import type { ObservationEvent } from "od-lite";

export interface ReadFileObservation extends ObservationEvent {
  data: {
    type: 'read';
    output: string;
    error?: boolean;
  }
}

export interface CreateFileObservation extends ObservationEvent {
  data: {
    type: 'create';
    output: string;
    error?: boolean;
  }
}

export interface UpdateFileObservation extends ObservationEvent {
  data: {
    type: 'update';
    output: string;
    error?: boolean;
  }
}

export type FileSystemObservation = ReadFileObservation | CreateFileObservation | UpdateFileObservation;
