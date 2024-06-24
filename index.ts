import { Session, Topic } from "od-lite";
import { OpenAIAgent } from "./src/agent";
import { TerminalManager } from "./src/terminal-manager";
import chalk from "chalk";
import * as readline from 'readline';
import { BasicRuntime } from "./src/runtime";

const runtime = new BasicRuntime(new TerminalManager());
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
    console.log('\n' + chalk.yellow('[ACTION]'), chalk.blue('> ' + payload.data.command));
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
    const stripped = payload.data.output.endsWith('\n') ? payload.data.output.slice(0, -1) : payload.data.output;
    console.log(`${chalk.yellow('[OBSERVATION]')}${stripped ? '\n' + stripped : ' ' + chalk.gray('EMPTY')}`);
  }
});
