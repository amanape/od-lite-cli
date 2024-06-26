import { Session } from "od-lite";
import { OpenAIAgent } from "./core/agent";
import CLI from "./core/cli";
import BunRuntime from "./core/bun-runtime";

const session = new Session(
  new OpenAIAgent(),
  new BunRuntime(),
);

const debug = Bun.argv.includes('--debug');

const cli = new CLI(session, { debug });
cli.start();
