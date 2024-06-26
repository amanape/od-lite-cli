import type { ObservationEvent } from "od-lite";

export interface ReadFileObservation extends ObservationEvent {
  data: {
    type: 'read';
    output: string;
  }
}

export interface CreateFileObservation extends ObservationEvent {
  data: {
    type: 'create';
    output: string;
  }
}

export interface UpdateFileObservation extends ObservationEvent {
  data: {
    type: 'update';
    output: string;
  }
}

export type FileSystemObservation = ReadFileObservation | CreateFileObservation | UpdateFileObservation;
