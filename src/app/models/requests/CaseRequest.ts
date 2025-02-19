import { CourtCaseDto } from "../CourtCaseDto";
import { CourtDto } from "../CourtDto";

export interface CaseRequest{
  courtCaseDto: CourtCaseDto;
  courtDto: CourtDto;
}
