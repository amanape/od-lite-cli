import { Agent, Topic, type Message, type Action } from "od-lite";
import Together from "together-ai";
import { EXAMPLES, MINIMAL_SYSTEM_PREFIX, SYSTEM_SUFFIX } from "./prompt";
import OpenAI from "openai";

const systemPrompt = `${MINIMAL_SYSTEM_PREFIX}\n\n${SYSTEM_SUFFIX}`;
const example = `Here is an example of how you can interact with the environment for task solving:\n${EXAMPLES}\n\nNOW, LET'S START!`

const parse = (response: string | undefined | null) => {
  const regex = /<execute_command>(.*?)<\/execute_command>/;
  const match = response?.match(regex);

  return match?.[1];
}

export class TogetherAgent implements Agent {
  private readonly together: Together;

  constructor() {
    this.together = new Together({
      apiKey: Bun.env.TOGETHER_API_KEY,
    });
  }

  public async query(message: string): Promise<Action | Message> {
    const response = await this.together.chat.completions.create({
      model: "Qwen/Qwen2-72B-Instruct",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: example },
        { role: "user", content: message },
      ],
    });

    const content = response.choices?.[0].message?.content;
    const command = parse(content);

    if (command) return { type: Topic.ACTION, data: { command: command } };
    return { type: Topic.MESSAGE, data: { message: content } };
  }
}

export class OpenAIAgent implements Agent {
  private readonly openai: OpenAI;
  private readonly messages: { role: "user" | "system"; content: string; }[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: example },
  ];

  constructor() {
    this.openai = new OpenAI({
      apiKey: Bun.env.OPENAI_API_KEY,
    });
  }

  public async query(message: string): Promise<Action | Message> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        ...this.messages,
        { role: "user", content: message },
      ],
    });

    const content = response.choices?.[0].message?.content;
    const command = parse(content);

    if (command) return { type: Topic.ACTION, data: { command: command } };
    return { type: Topic.MESSAGE, data: { role: "ai", message: content } };
  }
}
