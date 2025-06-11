import { convergentSystem, initialAxioms, secondaryAxioms } from "./7.12.config";
import { writeCompletedSystemToFile } from "../helpers";
import { Completion } from "../completion";

const completion = new Completion(initialAxioms);
const completedRules = completion.complete();
completion.checkIfRulesContainSystem(convergentSystem);
writeCompletedSystemToFile(completedRules, convergentSystem, 'completed_system_E.txt');

const completion2 = new Completion(secondaryAxioms);
const completedRules2 = completion2.complete();
completion2.checkIfRulesContainSystem(convergentSystem);
writeCompletedSystemToFile(completedRules2, convergentSystem, 'completed_system_E_prime.txt');