import { Topic, type Runtime } from "od-lite";
import type { Action } from "./types/actions";
import type { Observation } from "./types/observations";
import BunTerminalManager from "./bun-terminal-manager";
import BunFileManager from "./bun-file-manager";

const DEFAULT_ERROR_MESSAGE = "An unknown error occurred";

class BunRuntime implements Runtime<Action, Observation> {
  public static readonly version = "0.0.3";

  public async execute(action: Action): Promise<Observation> {
    try {
      // Add a prefix to the output
      let output = 'OBSERVATION: ';
      switch (action.data.type) {
        case "cmd": {
          output += await BunTerminalManager.run(action.data.command);
          return { type: Topic.OBSERVATION, data: { type: 'cmd', output } }
        }
        case "read": {
          output += await BunFileManager.read(action.data.path);
          return { type: Topic.OBSERVATION, data: { type: 'read', output } }
        }
        case "create": {
          output += await BunFileManager.create(action.data.path, action.data.content);
          return { type: Topic.OBSERVATION, data: { type: 'create', output } }
        }
        case "update": {
          output += await BunFileManager.update(action.data.path, action.data.content);
          return { type: Topic.OBSERVATION, data: { type: 'update', output } }
        }
      }
    } catch (error) {
      return {
        type: Topic.OBSERVATION,
        data: {
          type: action.data.type,
          error: true,
          output: 'ERROR: ' + (error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE)
        }
      };
    }
  }
}

export default BunRuntime;
