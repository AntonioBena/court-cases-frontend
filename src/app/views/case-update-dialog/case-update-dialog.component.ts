import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { CourtCaseDto } from '../../models/CourtCaseDto';
import { CaseDetailsDialogComponent } from '../case-details-dialog/case-details-dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { DecisionType } from '../../models/DecisionType';

@Component({
  selector: 'app-case-update-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule

  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './case-update-dialog.component.html',
  styleUrl: './case-update-dialog.component.css'
})
export class CaseUpdateDialogComponent {

  decisionForm!: FormGroup;
  caseForm!: FormGroup;
  caseDetail!: CourtCaseDto;
  availableDecisions: { decisionLabel: string }[] = [];
  availableDecisionTypes = Object.keys(DecisionType).filter(key => isNaN(Number(key)));

    constructor(
      public dialogRef: MatDialogRef<CaseUpdateDialogComponent>, private fb: FormBuilder,
      @Inject(MAT_DIALOG_DATA) public data: CourtCaseDto
    ) {
      this.createForm();
      this.caseDetail = data;
      this.availableDecisions = this.data.decisions || [];
    }

//TODO      Forma za ažuriranje podataka o predmetu mora imati i mogućnost upisivanja nove odluke na
// TODO     predmet i mogućnost prebacivanja predmeta u status „riješen“ uz posebno označavanje odluke
// TODO     kojom je predmet riješen.

    private createForm(): void {
      this.caseForm = this.fb.group({
        caseLabel: [this.data.caseLabel, Validators.required],
        caseStatus: [{ value: this.data.caseStatus, disabled: true }],
        description: [this.data.description, Validators.required],
        courtName: [this.data.court.courtName, Validators.required],
        courtAddress: [this.data.court.courtAddress, Validators.required],
        resolvingDecisionLabel: [
          this.data.resolvingDecisionLabel || ''
        ],
        // decisions: this.fb.array(
        //   this.data.decisions.map((decision) =>
        //     this.fb.group({
        //       decisionLabel: [decision.decisionLabel, Validators.required],
        //       decisionDescription: [decision.decisionDescription, Validators.required],
        //       decisionType: [decision.decisionType, Validators.required],
        //     })
        //   )
        // ),
      });

      this.decisionForm = this.fb.group({
        decisionLabel: ['', Validators.required],
        decisionDescription: ['', Validators.required],
        decisionType: ['', Validators.required],
        decisionDate: ['', Validators.required]
      });

    }

    get decisions(): FormArray {
      return this.caseForm.get('decisions') as FormArray;
    }

    onSubmit(): void {
      if (this.caseForm.valid) {
        console.log('Updated Case Data:', this.caseForm.value);
        // Call your service to update the case and decisions here
        this.dialogRef.close(this.caseForm.value); // Pass the updated data back
      }
    }

    onCancel(): void {
      this.dialogRef.close();
    }

    onClose(): void {
      this.dialogRef.close();
    }
}
