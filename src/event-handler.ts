import chalk from "chalk";
import { type Action } from "./types/actions";
import { type Observation } from "./types/observations";

export class EventHandler {
  static async handleAction(action: Action) {
    switch (action.data.type) {
      case "cmd":
        console.log('\n' + chalk.yellow('[ACTION]'), chalk.blue('>'), action.data.command);
        break;
      case "read":
      case "create":
      case "update":
        console.log('\n' + chalk.yellow('[ACTION]'), chalk.blue(`[${action.data.type.toUpperCase()}]`), action.data.path);
        break;
    }
  }

  static async handleObservation(observation: Observation) {
    switch (observation.data.type) {
      case "cmd":
        console.log(chalk.yellow('[OBSERVATION]'), observation.data.output.trim() || chalk.gray('EMPTY'));
        break;
      case "read":
      case "create":
      case "update":
        console.log(chalk.yellow('[OBSERVATION]'), chalk.blue(`[${observation.data.type.toUpperCase()}]`), observation.data.output.trim() || chalk.gray('EMPTY'));
        break;
    }
  }
}
