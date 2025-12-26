import { CyclePhase } from "../cycle/state";

export type PhaseMessages = {
  [key in CyclePhase]: string[];
};
