import { Agent, Topic, type Message, type Action } from "od-lite";
import Together from "together-ai";
import OpenAI from "openai";
import { parse } from "./utils";
import { SYSTEM_PROMPT, USER_EXAMPLE } from "./prompt";

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
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: USER_EXAMPLE },
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
  private readonly messages: { role: "user" | "system" | "assistant"; content: string; }[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: USER_EXAMPLE },
  ];

  constructor() {
    this.openai = new OpenAI({
      apiKey: Bun.env.OPENAI_API_KEY,
    });
  }

  public async query(message: string): Promise<Action | Message> {
    this.messages.push({ role: "user", content: message });
    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: this.messages,
    });

    const content = response.choices?.[0].message?.content;
    this.messages.push({ role: "assistant", content: content });

    const command = parse(content);
    if (command) return { type: Topic.ACTION, data: { command: command } };
    return { type: Topic.MESSAGE, data: { role: "ai", message: content } };
  }
}
