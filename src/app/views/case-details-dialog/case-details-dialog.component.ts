import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CourtCaseDto } from '../../models/CourtCaseDto';
import { CommonModule, NgFor } from '@angular/common';
import { DecisionType } from '../../models/DecisionType';
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'app-case-details-dialog',
  imports: [
    MatDialogModule,
    NgFor,
    CommonModule,
    MatExpansionModule
  ],
  templateUrl: './case-details-dialog.component.html',
  styleUrl: './case-details-dialog.component.css'
})
export class CaseDetailsDialogComponent {

  caseDetail!: CourtCaseDto;

  constructor(
    public dialogRef: MatDialogRef<CaseDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CourtCaseDto
  ) {
    this.caseDetail = data;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  getDecisionTypeLabel(decisionType: DecisionType): string {
    return decisionType === DecisionType.RULING ? 'Presuda' : 'Rjesenje';
  }

}
