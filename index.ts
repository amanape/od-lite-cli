import { Session, Topic } from "od-lite";
import { OpenAIAgent } from "./src/agent";
import { TerminalManager } from "./src/managers/terminal-manager";
import chalk from "chalk";
import * as readline from 'readline';
import { BasicRuntime } from "./src/runtime";
import { FileManager } from "./src/managers/file-manager";
import { isCommandAction } from "./src/types/actions";
import { isCommandObservation } from "./src/types/observations";

const runtime = new BasicRuntime(new TerminalManager(), new FileManager());
const openAIAgent = new OpenAIAgent();

const session = new Session(openAIAgent, runtime);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const promptUser = (text: string) => {
  rl.question(`\n${chalk.blue('OpenDevin')}: ${text}\n${chalk.green('You')}: `, async (answer) => {
    session.pubsub.publish({ type: Topic.MESSAGE, data: { role: "user", message: answer } });
  });
}

promptUser('How can I help you today?');

session.actions.subscribe({
  next: async (payload) => {
    console.log(chalk.gray(JSON.stringify(payload, null, 2)));

    if (isCommandAction(payload)) {
      console.log('\n' + chalk.yellow('[ACTION]'), chalk.blue('> ' + payload.data.command));
    } else {
      console.log('\n' + chalk.yellow('[ACTION]'), chalk.blue('[READ] ' + payload.data.path));
    }
  }
});

session.messages.subscribe({
  next: async (payload) => {
    if (payload.data.role === 'ai') {
      promptUser(payload.data.message);
    }
  }
});

session.observations.subscribe({
  next: (payload) => {
    if (isCommandObservation(payload)) {
      const stripped = payload.data.output.endsWith('\n') ? payload.data.output.slice(0, -1) : payload.data.output;
      console.log(`${chalk.yellow('[OBSERVATION]')}${stripped ? '\n' + stripped : ' ' + chalk.gray('EMPTY')}`);
    } else {
      console.log(`${chalk.yellow('[OBSERVATION]')} ${chalk.blue('[READ]')} ${payload.data.path}`);
      console.log(`${chalk.yellow('[OBSERVATION]')} ${chalk.blue('[CONTENT]')} ${payload.data.output}`);
    }
  }
});
