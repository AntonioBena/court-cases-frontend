import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CourtCaseDto } from '../../models/CourtCaseDto';
import { DecisionDto } from '../../models/DecisionDto';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DecisionType } from '../../models/DecisionType';
import { DecisionService } from '../../service/DecisionService';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { ToastrService } from '../../toastr.service';
import { catchError, firstValueFrom, lastValueFrom, throwError } from 'rxjs';

@Component({
  selector: 'app-decision-dialog',
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
  ],
  templateUrl: './decision-dialog.component.html',
  styleUrl: './decision-dialog.component.css',
})
export class DecisionDialogComponent {
  availableDecisionTypes: DecisionType[] = [
    DecisionType.JUDGMENT,
    DecisionType.RULING,
  ];

  decisionTypeLabels: Record<DecisionType, string> = {
    [DecisionType.JUDGMENT]: 'JUDGMENT',
    [DecisionType.RULING]: 'Settlement',
  };

  createForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DecisionDialogComponent>, private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private decisionService: DecisionService
  ) {
    this.createForm = this.fb.group({
      decisionLabel: ['', [Validators.required]],
      decisionDescription: ['', [Validators.required]],

      decisionType: ['', [Validators.required]],
      decisionDate: ['', [Validators.required]],
    });

    console.log('passed data: ' + JSON.stringify(data));
  }

  onCancel() {
    this.dialogRef.close();
  }

  async createNewDecision() {
    if (this.createForm.valid) {
      console.log('New decision with case label:', this.createForm.value);

      try {
        let createdDecision = await firstValueFrom(
          this.decisionService.createDecision(this.data.caseLabel, this.createForm.value)
        );

        this.dialogRef.close(createdDecision);
      } catch (error) {
        console.error('Decision creation error:', error);
        this.showToast('error', 'Decision creation error')
      }
    }
  }

  showToast(type: string, message: string) {
    this.toastr.showToast(type, message, 'top-right', true);
  }

}
