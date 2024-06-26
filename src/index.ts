import { Session } from "od-lite";
import { Command } from "commander";
import { OpenAIAgent } from "./core/agent";
import CLI from "./core/cli";
import BunRuntime from "./core/bun-runtime";

const program = new Command();
program
  .version('0.0.1')
  .description('An example CLI that utilizes od-lite')
  .option('-d, --debug', 'output debugging information')
  .parse(Bun.argv);

const { debug } = program.opts();

const session = new Session(
  new OpenAIAgent(),
  new BunRuntime(),
);

const cli = new CLI(session, { debug });
cli.start();
