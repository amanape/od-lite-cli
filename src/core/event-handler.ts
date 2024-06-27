import chalk from "chalk";
import type { Action, Observation } from "od-core";

export class EventHandler {
  static async handleAction(action: Action) {
    switch (action.data.identifier) {
      case "cmd":
        console.log('\n' + chalk.yellow('[ACTION]'), chalk.blue(`[${action.data.identifier.toUpperCase()}]`), action.data.command);
        break;
      case "read":
      case "create":
      case "update":
        console.log('\n' + chalk.yellow('[ACTION]'), chalk.blue(`[${action.data.identifier.toUpperCase()}]`), action.data.path);
        break;
    }
  }

  static async handleObservation(observation: Observation) {
    // remove OBSERVATION: or ERROR: prefix
    const output = observation.data.output.replace(/^(OBSERVATION|ERROR): /, '').trim();
    switch (observation.data.identifier) {
      case "cmd":
        console.log(
          chalk.yellow('[OBSERVATION]'),
          observation.data.error ? chalk.red('[ERROR]') : chalk.green('[SUCCESS]'),
          chalk.gray(output || 'EMPTY'),
        );
        break;
      case "read":
      case "create":
      case "update":
        console.log(
          chalk.yellow('[OBSERVATION]'),
          observation.data.error ? chalk.red('[ERROR]') : chalk.green('[SUCCESS]'),
          chalk.gray(output || 'EMPTY'),
        );
        break;
    }
  }
}
