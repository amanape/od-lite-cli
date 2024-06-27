import type { Action, Observation } from "od-core";
import { Topic, type Runtime } from "od-lite";
import BunTerminalManager from "./bun-terminal-manager";
import BunFileManager from "./bun-file-manager";

const DEFAULT_ERROR_MESSAGE = "An unknown error occurred";

class BunRuntime implements Runtime<Action, Observation> {
  public static readonly version = "0.0.3";

  public async execute(action: Action): Promise<Observation> {
    try {
      // Add a prefix to the output
      let output = 'OBSERVATION: ';
      switch (action.data.identifier) {
        case "cmd": {
          output += await BunTerminalManager.run(action.data.command);
          return { type: Topic.OBSERVATION, data: { identifier: 'cmd', output } }
        }
        case "read": {
          output += await BunFileManager.read(action.data.path);
          return { type: Topic.OBSERVATION, data: { identifier: 'read', output } }
        }
        case "create": {
          output += await BunFileManager.create(action.data.path, action.data.content);
          return { type: Topic.OBSERVATION, data: { identifier: 'create', output } }
        }
        case "update": {
          output += await BunFileManager.update(action.data.path, action.data.content);
          return { type: Topic.OBSERVATION, data: { identifier: 'update', output } }
        }
      }
    } catch (error) {
      // @ts-expect-error - `data.type` does not recognize that the type is valid
      return {
        type: Topic.OBSERVATION,
        data: {
          identifier: action.data.identifier,
          error: true,
          output: 'ERROR: ' + (error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE)
        }
      };
    }
  }
}

export default BunRuntime;
