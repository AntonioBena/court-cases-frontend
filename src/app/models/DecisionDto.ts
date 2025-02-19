import { DecisionType } from './DecisionType';

export interface DecisionDto {
  id: number;
  decisionLabel: string;
  decisionDescription: string;
  decisionType: DecisionType;
  decisionDate: Date;
}
