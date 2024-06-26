import { Agent, Topic, type Message } from "od-lite";
import OpenAI from "openai";
import { parseForCommand, parseForFs } from "../utils/utils";
import { SYSTEM_PROMPT, USER_EXAMPLE } from "../utils/prompt";
import type { Action } from "../types/actions";

export class OpenAIAgent implements Agent<Action> {
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
    this.messages. push({ role: "assistant", content: content || "NULL" });

    const command = parseForCommand(content);
    const fs = parseForFs(content);

    if (command) return { type: Topic.ACTION, data: { type: "cmd", command: command } };
    if (fs.operation && fs.path) {
      if (fs.operation === 'read') return { type: Topic.ACTION, data: { type: "read", path: fs.path } };
      if (fs.operation === 'create') return { type: Topic.ACTION, data: { type: "create", path: fs.path, content: fs.content } };
      if (fs.operation === 'update' && fs.content) return { type: Topic.ACTION, data: { type: "update", path: fs.path, content: fs.content } };
    }

    return { type: Topic.MESSAGE, data: { role: "ai", message: content || "NULL" } };
  }
}
