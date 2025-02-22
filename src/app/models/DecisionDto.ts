import { DecisionType } from './DecisionType';

export class DecisionDto {
  id!: number;
  decisionLabel!: string;
  decisionDescription!: string;
  decisionType!: DecisionType;
  decisionDate!: Date;
}
