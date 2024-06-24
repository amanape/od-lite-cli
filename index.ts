import { Session } from "od-lite";
import { OpenAIAgent } from "./src/implementations/agent";
import { TerminalManager } from "./src/managers/terminal-manager";
import { BasicRuntime } from "./src/implementations/runtime";
import { FileManager } from "./src/managers/file-manager";
import CLI from "./src/cli";

const session = new Session(
  new OpenAIAgent(),
  new BasicRuntime(new TerminalManager(), new FileManager())
);

const cli = new CLI(session);
cli.start();
