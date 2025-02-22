import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CourtCaseDto } from '../../models/CourtCaseDto';
import { CaseRequest } from '../../models/requests/CaseRequest';
import { CaseService } from '../../service/CaseService';
import { ToastrService } from '../../toastr.service';
import { catchError, throwError } from 'rxjs';
import { CourtDto } from '../../models/CourtDto';

@Component({
  selector: 'app-case-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './case-create.component.html',
  styleUrl: './case-create.component.css',
})
export class CaseCreateComponent {
  createForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CaseCreateComponent>,
    private caseService: CaseService,
    private toastr: ToastrService
  )
  {
    this.createForm = this.fb.group({
      caseLabel: ['', [Validators.required]],
      description: ['', [Validators.required]],

      courtName: ['', [Validators.required]],
      courtAddress: ['', [Validators.required]],
    });
  }

  createNewCase() {
    if (this.createForm.valid) {
      console.log('Formed Case Data:', this.createForm.value);

      let newCaseRequest = new CaseRequest();
      let ncase = new CourtCaseDto();
      let ccourt = new CourtDto();

      ncase.caseLabel = this.createForm.value.caseLabel;
      ncase.description = this.createForm.value.description;

      ccourt.courtName = this.createForm.value.courtName;
      ccourt.courtAddress = this.createForm.value.courtAddress;

      newCaseRequest.courtCaseDto = ncase;
      newCaseRequest.courtDto = ccourt;

      console.log("casereq" + JSON.stringify(newCaseRequest));

      this.caseService
        .createCase(newCaseRequest)
        .pipe(
          catchError((error) => {
            if (error.status === 400) {
              this.showToast('please check your inputs');
            }
            console.error('Case creation error:');
            this.showToast(error);
            return throwError(() => new Error('Create caser error ' + error));
          })
        )
        .subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  showToast(message: string) {
    this.toastr.showToast('error', 'Case creation failed! ' + message, 'top-right', true);
  }
}
