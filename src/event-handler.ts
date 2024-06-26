import chalk from "chalk";
import { type Action } from "./types/actions";
import { type Observation } from "./types/observations";

export class EventHandler {
  static async handleAction(action: Action) {
    if (action.data.type === 'cmd') {
      console.log('\n' + chalk.yellow('[ACTION]'), '> ' + chalk.blue(action.data.command));
    } else {
      console.log('\n' + chalk.yellow('[ACTION]'), '[READ] ' + chalk.blue(action.data.path));
    }
  }

  static async handleObservation(observation: Observation) {
    if (observation.data.type === 'cmd') {
      const stripped = observation.data.output.endsWith('\n') ? observation.data.output.slice(0, -1) : observation.data.output;
      console.log(`${chalk.yellow('[OBSERVATION]')}${stripped ? '\n' + stripped : ' ' + chalk.gray('EMPTY')}`);
    } else {
      console.log(`${chalk.yellow('[OBSERVATION]')} ${chalk.blue('[CONTENT]')} ${observation.data.output}`);
    }
  }
}
