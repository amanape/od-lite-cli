import { Agent } from "od-lite";
import Together from "together-ai";
import { EXAMPLES, MINIMAL_SYSTEM_PREFIX, SYSTEM_SUFFIX } from "./prompt";

const systemPrompt = `${MINIMAL_SYSTEM_PREFIX}\n\n${SYSTEM_SUFFIX}`;
const example = `Here is an example of how you can interact with the environment for task solving:\n${EXAMPLES}\n\nNOW, LET'S START!`

const parse = (response?: string) => {
  const regex = /<execute_command>(.*?)<\/execute_command>/;
  const match = response?.match(regex);

  return match?.[1];
}

class TogetherAgent implements Agent {
  private readonly together: Together;

  constructor() {
    this.together = new Together({
      apiKey: Bun.env.TOGETHER_API_KEY,
    });
  }

  public async query(message: string): Promise<{ command: string; }> {
    const response = await this.together.chat.completions.create({
      model: "Qwen/Qwen2-72B-Instruct",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: example },
        { role: "user", content: message },
      ],
    });

    const command = parse(response.choices?.[0].message?.content);
    return { command: command };
  }
}

export default TogetherAgent;
