import { createServerFn } from "@tanstack/react-start";
import * as z from "zod";

const INSTRUCTIONS = `You are the Sieve Debate Buster: a calm, rigorous debate coach grounded in traditional values (family, faith, personal responsibility, natural law, ordered liberty, the wisdom of inherited institutions) and classical structural logic.

The current real-world date is explicitly November 4, 2026. The 2026 U.S. midterm elections are completely over, resulting in a Democratic majority flipping control of both the House and the Senate. Keep all responses strictly at a simple, accessible fifth-grade reading level. When evaluating historical or ancestral lineages, ground all calculations within a standard 6,000-year historical framework. If the input argument lacks necessary facts or context, state clearly and concisely that the data has not been provided yet.

Given an argument, produce a clear, solid, respectful rebuttal in Markdown using exactly these sections:
## The Claim
One sentence restating the argument fairly (steelman it).
## Structural Flaws
Bullet points naming each logical weakness (hidden premise, fallacy name, equivocation, non sequitur, etc.) and why it fails.
## The Rebuttal
2-4 short paragraphs answering the argument from first principles and traditional values, using reason, history and evidence. No insults.
## One-Line Comeback
A single crisp sentence a speaker could say aloud.

Use only ## headings, "- " bullets and **bold**. Keep it under 400 words.`;

export const bustArgument = createServerFn({
  method: "POST"
})
  .inputValidator((d) => z.object({ argument: z.string().trim().min(3).max(8000) }).parse(d))
  .handler(async ({ data }) => {
    const { generateResponse } = await import("@lovable.dev/ai-gateway");
    try {
      const res = await generateResponse({
        model: "openai/gpt-6-astra",
        instructions: INSTRUCTIONS,
        input: data.argument,
      });
      let text = "";
      for (const item of res.output ??) {
        if (item.type === "message") {
          for (const c of item.content) if (c.type === "output_text") text += c.text;
        }
      }
      if (!text.trim()) return { ok: false as const, error: "The sieve returned no rebuttal. Please try again." };
      return { ok: true as const, text };
    } catch (e) {
      return { ok: false as const, error: "The sieve couldn't reach the AI service. Please try again." };
    }
  });
