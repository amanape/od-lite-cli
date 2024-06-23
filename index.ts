import { Session, Topic } from "od-lite";
import { OpenAIAgent } from "./agent";
import TM from "./tm";
import chalk from "chalk";
import * as readline from 'readline';
import { BasicRuntime } from "./runtime";

const runtime = new BasicRuntime(new TM());
const openAIAgent = new OpenAIAgent();

const session = new Session(openAIAgent, runtime);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(`${chalk.blue('OpenDevin')}: How can I help you today?\n${chalk.green('You')}: `, async (answer) => {
  session.pubsub.publish({ type: Topic.MESSAGE, data: { role: "user", message: answer } });
  rl.close();
});

session.actions.subscribe({
  next: async (payload) => {
    console.log(chalk.yellow('[ACTION]'), chalk.blue(payload.data.command));
  }
});

session.messages.subscribe({
  next: async (payload) => {
    console.log(chalk.gray(JSON.stringify(payload, null, 2)));

    if (payload.data.role === 'ai') {
      console.log(`${chalk.blue('OpenDevin')}: `, payload.data.message);
    } else {
      console.log(chalk.gray('[LOADING]'), 'Processing your request...');
    }
  }
});

session.observations.subscribe({
  next: (payload) => {
    console.log(chalk.yellow('[OBSERVATION]'), payload.data.output);
  }
});
