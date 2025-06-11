import { convergentSystem, initialAxioms } from "./7.12.config";
import { writeCompletedSystemToFile } from "../helpers";
import { Completion } from "../completion";

const completion = new Completion(initialAxioms);
const completedRules = completion.complete();
completion.checkIfRulesContainSystem(convergentSystem);
writeCompletedSystemToFile(completedRules, convergentSystem);