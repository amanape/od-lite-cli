import { Topic, type Runtime } from "od-lite";
import type { Action } from "./types/actions";
import type { Observation } from "./types/observations";
import BunTerminalManager from "./bun-terminal-manager";
import BunFileManager from "./bun-file-manager";

class BunRuntime implements Runtime<Action, Observation> {
  public static readonly version = "0.0.1";

  public async execute(action: Action): Promise<Observation> {
    if (action.data.type === 'cmd') {
      const output = await BunTerminalManager.run(action.data.command);
      return { type: Topic.OBSERVATION, data: { type: 'cmd', output } };
    } else if (action.data.type === 'read') {
      const contents = await BunFileManager.read(action.data.path);
      return { type: Topic.OBSERVATION, data: { type: 'read', output: contents } };
    } else if (action.data.type === 'create') {
      const result = await BunFileManager.create(action.data.path, action.data.content);
      return { type: Topic.OBSERVATION, data: { type: 'create', output: result } };
    } else { // fs update
      const contents = await BunFileManager.update(action.data.path, action.data.content);
      return { type: Topic.OBSERVATION, data: { type: 'update', output: contents } };
    }
  }
}

export default BunRuntime;
