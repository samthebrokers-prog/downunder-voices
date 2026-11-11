/**
 * Master switch for paid OpenAI use (owner decision, 12 Nov 2026: "spend nothing").
 *
 * While AI is OFF, every feature that would call OpenAI skips quietly:
 *  - the radio keeps playing music and its recorded programmes (no new news bulletins),
 *  - imported stories are published as their original feed text,
 *  - automated editorials, election articles, Audaisuki news and Lanka Witness analysis pause.
 *
 * To turn AI back on later (after topping up the OpenAI credit), set the Vercel
 * environment variable DV_AI_ENABLED=true and redeploy — no code change needed.
 */
export function aiEnabled(): boolean {
  return process.env.DV_AI_ENABLED === 'true'
}

/** The OpenAI key, or undefined while AI is switched off. */
export function openAiKey(): string | undefined {
  return aiEnabled() ? process.env.OPENAI_API_KEY : undefined
}
