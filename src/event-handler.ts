import chalk from "chalk";
import { isCommandAction, type Action } from "./types/actions";
import { isCommandObservation, type Observation } from "./types/observations";

export class EventHandler {
  static async handleAction(action: Action) {
    console.log(chalk.gray(JSON.stringify(action, null, 2)));

    if (isCommandAction(action)) {
      console.log('\n' + chalk.yellow('[ACTION]'), '> ' + chalk.blue(action.data.command));
    } else {
      console.log('\n' + chalk.yellow('[ACTION]'), '[READ] ' + chalk.blue(action.data.path));
    }
  }

  static async handleObservation(observation: Observation) {
    console.log(chalk.gray(JSON.stringify(observation, null, 2)));

    if (isCommandObservation(observation)) {
      const stripped = observation.data.output.endsWith('\n') ? observation.data.output.slice(0, -1) : observation.data.output;
      console.log(`${chalk.yellow('[OBSERVATION]')}${stripped ? '\n' + stripped : ' ' + chalk.gray('EMPTY')}`);
    } else {
      console.log(`${chalk.yellow('[OBSERVATION]')} ${chalk.blue('[READ]')} ${observation.data.path}`);
      console.log(`${chalk.yellow('[OBSERVATION]')} ${chalk.blue('[CONTENT]')} ${observation.data.output}`);
    }
  }
}
