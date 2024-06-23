import { ObservationFactory, type Runtime, type TerminalManager, RxPubSub, Topic } from "od-lite";
import { OpenAIAgent } from "./agent";
import TM from "./tm";
import type { Action } from "od-lite/dist/types/actions";
import type { Observation } from "od-lite/dist/types/observations";
import chalk from "chalk";

const pubsub = new RxPubSub();

class BasicRuntime implements Runtime {
  constructor(private readonly terminalManager: TerminalManager) { }

  public async handle(action: Action): Promise<Observation> {
    const output = await this.terminalManager.write(action.data.command);
    return ObservationFactory.fromTerminalOutput(action.data.command, output);
  }
}

const runtime = new BasicRuntime(new TM());
const openAIAgent = new OpenAIAgent();

const message = pubsub.subscribe(Topic.MESSAGE);
const observation = pubsub.subscribe(Topic.OBSERVATION);
const action = pubsub.subscribe(Topic.ACTION);

action.subscribe({
  next: async (payload) => {
    const observation = await runtime.handle(payload);
    pubsub.publish(observation);
  },
});

action.subscribe({
  next: async (payload) => {
    console.log(chalk.yellow('[ACTION]'), chalk.blue(payload.data.command));
  }
});

message.subscribe({
  next: async (payload) => {
    if (payload.data.role === 'user') {
      const action = await openAIAgent.query(payload.data.message);
      pubsub.publish(action);
    }
  },
});

message.subscribe({
  next: async (payload) => {
    console.log(chalk.gray(JSON.stringify(payload, null, 2)));
    
    if (payload.data.role === 'ai') {
      console.log(`${chalk.blue('OpenDevin')}: `, payload.data.message);
    } else {
      console.log(chalk.gray('[LOADING]'), 'Processing your request...');
    }
  }
});

observation.subscribe({
  next: async (payload) => {
    const action = await openAIAgent.query(payload.data.output);

    if (action.type === Topic.MESSAGE) {
      pubsub.publish(action);
    }

    // pubsub.publish(action);
  }
});

observation.subscribe({
  next: (payload) => {
    console.log(chalk.yellow('[OBSERVATION]'), payload.data.output);
  }
});

import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(`${chalk.blue('OpenDevin')}: How can I help you today?\n${chalk.green('You')}: `, async (answer) => {
  pubsub.publish({ type: Topic.MESSAGE, data: { role: "user", message: answer } });
  rl.close();
});
