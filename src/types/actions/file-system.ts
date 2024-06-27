import type { ActionEvent } from "od-lite";

export interface ReadFileAction extends ActionEvent {
  data: {
    type: 'read';
    path: string;
  }
}

export interface CreateFileAction extends ActionEvent {
  data: {
    type: 'create';
    path: string;
    content?: string;
  }
}

export interface UpdateFileAction extends ActionEvent {
  data: {
    type: 'update';
    path: string;
    content: string;
  }
}

export type FileSystemAction = ReadFileAction | CreateFileAction | UpdateFileAction;
