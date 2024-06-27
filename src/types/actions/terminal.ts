import type { ActionEvent } from "od-lite";

export interface CommandAction extends ActionEvent {
  data: {
    type: 'cmd';
    command: string;
  }
}

export type TerminalAction = CommandAction;
