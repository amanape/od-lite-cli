import { Agent, Runtime, RxPubSub, Topic } from "od-lite";

class Session {
  public readonly pubsub = new RxPubSub();

  public readonly messages = this.pubsub.subscribe(Topic.MESSAGE);
  public readonly actions = this.pubsub.subscribe(Topic.ACTION);
  public readonly observations = this.pubsub.subscribe(Topic.OBSERVATION);

  constructor(
    private readonly agent: Agent,
    private readonly runtime: Runtime,
  ) {
    this.registerMessages();
    this.registerActions();
    this.registerObservations();
  }

  private registerMessages() {
    this.messages.subscribe({
      next: async (payload) => {
        if (payload.data.role === 'user') {
          const action = await this.agent.query(payload.data.message);
          this.pubsub.publish(action);
        }
      },
    });
  }

  private registerActions() {
    this.actions.subscribe({
      next: async (payload) => {
        const observation = await this.runtime.handle(payload);
        this.pubsub.publish(observation);
      },
    });
  }

  private registerObservations() {
    this.observations.subscribe({
      next: async (payload) => {
        const action = await this.agent.query(payload.data.output);

        if (action.type === Topic.MESSAGE) {
          this.pubsub.publish(action);
        }

        // pubsub.publish(action);
      }
    });
  }
}

export default Session;
