import { CaseStatus } from "./CaseStatus";
import { CourtDto } from "./CourtDto";
import { DecisionDto } from "./DecisionDto";

export interface CourtCaseDto {
  id: number;
  caseLabel: string;
  caseStatus: CaseStatus;
  court: CourtDto;
  decisions: DecisionDto[];
  resolvingDecisionLabel: string;
}
