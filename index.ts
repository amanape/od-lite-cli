import { Session } from "od-lite";
import { OpenAIAgent } from "./src/agent";
import CLI from "./src/cli";
import BunRuntime from "./src/bun-runtime";

const session = new Session(
  new OpenAIAgent(),
  new BunRuntime(),
);

const debug = Bun.argv.includes('--debug');

const cli = new CLI(session, { debug });
cli.start();
