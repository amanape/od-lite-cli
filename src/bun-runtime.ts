import { Topic, type Runtime } from "od-lite";
import type { Action } from "./types/actions";
import type { Observation } from "./types/observations";
import BunTerminalManager from "./bun-terminal-manager";
import BunFileManager from "./bun-file-manager";

const DEFAULT_ERROR_MESSAGE = "An unknown error occurred";

class BunRuntime implements Runtime<Action, Observation> {
  public static readonly version = "0.0.2";

  public async execute(action: Action): Promise<Observation> {
    try {
      switch (action.data.type) {
        case "cmd": {
          const output = await BunTerminalManager.run(action.data.command);
          return { type: Topic.OBSERVATION, data: { type: 'cmd', output } };
        }
        case "read": {
          const contents = await BunFileManager.read(action.data.path);
          return { type: Topic.OBSERVATION, data: { type: 'read', output: contents } };
        }
        case "create": {
          const result = await BunFileManager.create(action.data.path, action.data.content);
          return { type: Topic.OBSERVATION, data: { type: 'create', output: result } };
        }
        case "update": {
          const contents = await BunFileManager.update(action.data.path, action.data.content);
          return { type: Topic.OBSERVATION, data: { type: 'update', output: contents } };
        }
      }
    } catch (error) {
      return {
        type: Topic.OBSERVATION,
        data: {
          type: action.data.type,
          error: true,
          output: error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE
        }
      };
    }
  }
}

export default BunRuntime;
