import type { FileSystemObservation } from "./file-system";
import type { TerminalObservation } from "./terminal";

export type Observation = TerminalObservation | FileSystemObservation;
