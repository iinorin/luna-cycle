import { CyclePhase } from "../cycle/state";
import { MESSAGES } from "./presets";

export function getMessageForPhase(phase: CyclePhase): string {
  const messages = MESSAGES[phase];

  if (!messages || messages.length === 0) {
    return "You are doing great 💙";
  }

  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}
