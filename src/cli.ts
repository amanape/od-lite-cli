import chalk from "chalk";
import * as readline from 'readline';

import { Session, type Message, Topic } from "od-lite";
import { type Action } from "./types/actions";
import { type Observation } from "./types/observations";
import { EventHandler } from "./event-handler";

class CLI {
  private readonly session: Session<Action, Observation>;
  private readonly rl: readline.Interface;

  constructor(session: Session<Action, Observation>) {
    this.session = session;

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.registerListeners();
  }

  public start() {
    this.promptUser('How can I help you today?');
  }

  private registerListeners() {
    this.session.messages.subscribe({ next: this.handleMessage.bind(this) });
    this.session.actions.subscribe({ next: EventHandler.handleAction });
    this.session.observations.subscribe({ next: EventHandler.handleObservation });
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
}

export default CLI;
