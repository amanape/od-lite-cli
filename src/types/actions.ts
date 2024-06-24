import type { ActionEvent } from "od-lite";

interface CommandAction extends ActionEvent {
  data: {
    command: string;
  }
}

interface ReadFileAction extends ActionEvent {
  data: {
    path: string;
  }
}

export const isCommandAction = (action: Action): action is CommandAction => 'command' in action.data;

export type Action = CommandAction | ReadFileAction;
