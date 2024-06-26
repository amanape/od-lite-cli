import { Topic, type Runtime } from "od-lite";
import type { Action } from "./types/actions";
import type { Observation } from "./types/observations";
import BunTerminalManager from "./bun-terminal-manager";
import BunFileManager from "./bun-file-manager";

const DEFAULT_ERROR_MESSAGE = "An unknown error occurred";

class BunRuntime implements Runtime<Action, Observation> {
  public static readonly version = "0.0.2";

  public async execute(action: Action): Promise<Observation> {
    switch (action.data.type) {
      case "cmd": {
        try {
          const output = await BunTerminalManager.run(action.data.command);
          return { type: Topic.OBSERVATION, data: { type: 'cmd', output } };
        } catch (error) {
          if (error instanceof Error) return { type: Topic.OBSERVATION, data: { type: 'cmd', error: true, output: error.message } };
          return { type: Topic.OBSERVATION, data: { type: 'cmd', error: true, output: DEFAULT_ERROR_MESSAGE } };
        }
      }
      case "read": {
        try {
          const contents = await BunFileManager.read(action.data.path);
          return { type: Topic.OBSERVATION, data: { type: 'read', output: contents } };
        } catch (error) {
          if (error instanceof Error) return { type: Topic.OBSERVATION, data: { type: 'read', error: true, output: error.message } };
          return { type: Topic.OBSERVATION, data: { type: 'read', error: true, output: DEFAULT_ERROR_MESSAGE } };
        }
      }
      case "create": {
        try {
          const result = await BunFileManager.create(action.data.path, action.data.content);
          return { type: Topic.OBSERVATION, data: { type: 'create', output: result } };
        } catch (error) {
          if (error instanceof Error) return { type: Topic.OBSERVATION, data: { type: 'create', error: true, output: error.message } };
          return { type: Topic.OBSERVATION, data: { type: 'create', error: true, output: DEFAULT_ERROR_MESSAGE } };
        }
      }
      case "update": {
        try {
          const contents = await BunFileManager.update(action.data.path, action.data.content);
          return { type: Topic.OBSERVATION, data: { type: 'update', output: contents } };
        } catch (error) {
          if (error instanceof Error) return { type: Topic.OBSERVATION, data: { type: 'update', error: true, output: error.message } };
          return { type: Topic.OBSERVATION, data: { type: 'update', error: true, output: DEFAULT_ERROR_MESSAGE } };
        }
      }
    }
  }
}

export default BunRuntime;
