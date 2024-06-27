import type { FileSystemAction } from "./file-system";
import type { TerminalAction } from "./terminal";

export type Action = TerminalAction | FileSystemAction;
