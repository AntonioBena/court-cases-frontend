import { CaseStatus } from "./CaseStatus";
import { CourtDto } from "./CourtDto";
import { DecisionDto } from "./DecisionDto";

export class CourtCaseDto {
  id!: number;
  caseLabel!: string;
  caseStatus!: CaseStatus;
  description!: string;
  court!: CourtDto;
  decisions!: DecisionDto[];
  resolvingDecisionLabel!: string;
}
