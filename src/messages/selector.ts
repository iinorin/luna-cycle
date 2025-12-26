import { CyclePhase } from "../cycle/state";
import { MESSAGES } from "./presets";

export function getDailyMessageForPhase(
  phase: CyclePhase
): string {
  const messages = MESSAGES[phase];

  if (!messages || messages.length === 0) {
    return "You are doing great 💙";
  }

  // Lock message per day
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  const index = seed % messages.length;
  return messages[index];
}
