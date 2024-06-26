import chalk from "chalk";
import * as readline from 'readline';

import { Session, type Message, Topic } from "od-lite";
import { type Action } from "./types/actions";
import { type Observation } from "./types/observations";
import { EventHandler } from "./event-handler";

type CLIConfig = {
  debug?: boolean;
}

class CLI {
  private readonly session: Session<Action, Observation>;
  private readonly rl: readline.Interface;

  constructor(session: Session<Action, Observation>, config: CLIConfig = {}) {
    this.session = session;

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // handle message events separately
    this.session.messages.subscribe({ next: this.handleMessage.bind(this) });

    config.debug ?
      this.registerVerboseListeners() :
      this.registerListeners();
  }

  public start() {
    this.promptUser('How can I help you today?');
  }

  private registerListeners() {
    this.session.actions.subscribe(EventHandler.handleAction);
    this.session.observations.subscribe(EventHandler.handleObservation);
  }

  private async handleMessage(message: Message) {
    if (message.data.role === 'ai') {
      this.promptUser(message.data.message);
    }
  }

  private promptUser(text: string) {
    this.rl.question(`\n${chalk.blue('AI')}: ${text}\n${chalk.cyan('You')}: `, async (answer) => {
      this.session.pubsub.publish({ type: Topic.MESSAGE, data: { role: "user", message: answer } });
    });
  }

  private registerVerboseListeners() {
    this.session.actions.subscribe((action) => {
      console.log(chalk.gray(JSON.stringify(action, null, 2)));
    });

    this.session.observations.subscribe((observation) => {
      console.log(chalk.gray(JSON.stringify(observation, null, 2)));
    });
  }
}

export default CLI;
