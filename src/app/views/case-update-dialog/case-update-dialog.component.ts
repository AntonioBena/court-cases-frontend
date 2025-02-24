import { CommonModule } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { CourtCaseDto } from '../../models/CourtCaseDto';
import { CaseDetailsDialogComponent } from '../case-details-dialog/case-details-dialog.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DecisionType } from '../../models/DecisionType';
import { DecisionDto } from '../../models/DecisionDto';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { DecisionDialogComponent } from '../decision-dialog/decision-dialog.component';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { CaseStatus } from '../../models/CaseStatus';
import { ToastrService } from '../../toastr.service';
import { CaseService } from '../../service/CaseService';
import { CaseRequest } from '../../models/requests/CaseRequest';
import { CourtDto } from '../../models/CourtDto';
import { MatPaginator } from '@angular/material/paginator';
import { OnInit } from '@angular/core';

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
    MatDatepickerModule,
    MatTableModule,
    MatPaginator
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './case-update-dialog.component.html',
  styleUrl: './case-update-dialog.component.css',
})
export class CaseUpdateDialogComponent implements OnInit {
  displayedColumns: string[] = [
    'decisionLabel',
    'decisionDescription',
    'decisionType',
    'decisionDate',
  ];
  isEdit: boolean = true;
  decisionsDataSource = new MatTableDataSource<DecisionDto>();
  decisionForm!: FormGroup;
  caseForm!: FormGroup;
  caseDetail!: CourtCaseDto;
  availableDecisions: { decisionLabel: string }[] = [];
  availableDecisionTypes = Object.keys(DecisionType).filter((key) =>
    isNaN(Number(key))
  );

  @ViewChild(MatPaginator) paginator!: MatPaginator;
    ngAfterViewInit() {
      this.decisionsDataSource.paginator = this.paginator;
    }

    pageSizes = [5];

  constructor(
    private fb: FormBuilder, //public dialogRef: MatDialogRef<CaseUpdateDialogComponent>,
    private dialogRef: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private caseService: CaseService
  ) {
    this.isEdit = data.isEdit;
    this.createForm();
    this.caseDetail = data;
    this.availableDecisions = this.data.decisions || [];
    this.decisionsDataSource.data = this.caseDetail.decisions;
  }
  ngOnInit(): void {
  }

  availableStatusTypes: CaseStatus[] = [
    CaseStatus.IN_PROGRESS,
    CaseStatus.RESOLVED,
  ];
  statusTypeLabels: Record<CaseStatus, string> = {
    [CaseStatus.IN_PROGRESS]: 'In progress',
    [CaseStatus.RESOLVED]: 'Solved',
  };

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
      resolvingDecisionLabel: //[this.data.resolvingDecisionLabel || ''],
      [
        { value: this.data.resolvingDecisionLabel || '', disabled: !this.isEdit }
      ]
    });

    this.decisionForm = this.fb.group({
      decisionLabel: ['', Validators.required],
      decisionDescription: ['', Validators.required],
      decisionType: ['', Validators.required],
      decisionDate: ['', Validators.required],
    });
  }

  async createNewDecision() {
    this.dialogRef
      .open(DecisionDialogComponent, {
        width: '600px',
        data: { caseLabel: this.data.caseLabel },
      })
      .afterClosed()
      .subscribe((result: DecisionDto) => {
        if (result) {
          console.log('New decision:', JSON.stringify(result));
          this.decisionsDataSource.data = [
            ...this.decisionsDataSource.data,
            result,
          ];
        }
      });
  }

  updateCase(){
    if (this.caseForm.valid) {
          console.log('Formed Case Data:', this.caseForm.value);

          let newCaseRequest = new CaseRequest();
          let ncase = new CourtCaseDto();
          let ccourt = new CourtDto();

          ncase.id = this.data.id;
          ncase.caseStatus = this.data.caseStatus;
          ncase.caseLabel = this.data.caseLabel;
          ncase.court = this.data.court;

          ncase.decisions = this.decisionsDataSource.data;
          ncase.resolvingDecisionLabel = this.caseForm.value.resolvingDecisionLabel;

          ncase.description = this.caseForm.value.description;

          ccourt.id = this.data.court.id;
          ccourt.courtName = this.caseForm.value.courtName;
          ccourt.courtAddress = this.caseForm.value.courtAddress;



          newCaseRequest.courtCaseDto = ncase;
          newCaseRequest.courtDto = ccourt;

          console.log("casereq" + JSON.stringify(newCaseRequest));

          this.caseService
            .updateCase(newCaseRequest)
            .pipe(
              catchError((error) => {
                if (error.status === 400) {
                  this.showToast('error', 'please check your inputs');
                }
                console.error('Case creation error:');
                this.showToast('error', 'Error updating case ' + this.caseForm.value.caseLabel);
                return throwError(() => new Error('Create caser error ' + error));
              })
            )
            .subscribe(() => {
              this.dialogRef.closeAll();
            });
        }
  }

  getDecisions(): DecisionDto[] {
    return this.caseDetail.decisions;
  }

  onSubmit(): void {
    if (this.caseForm.valid) {
      console.log('Case Data:', this.caseForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.closeAll();
  }

  mapStatus(option: string): string {
    if (option === 'IN_PROGRESS') {
      return 'In progress';
    } else {
      return 'Solved';
    }
  }

  showToast(type: string, message: string) {
    this.toastr.showToast(type, message, 'top-right', true);
  }
}
