import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TokenService } from '../../service/auth/TokenService';
import { Router } from '@angular/router';
import { ToastrService } from '../../toastr.service';
import { CaseService } from '../../service/CaseService';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { CourtCaseDto } from '../../models/CourtCaseDto';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { CaseDetailsDialogComponent } from '../case-details-dialog/case-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CaseUpdateDialogComponent } from '../case-update-dialog/case-update-dialog.component';
import { CaseCreateComponent } from '../case-create/case-create.component';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-main',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCard,
    MatCardContent,
    MatMenuModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  displayedColumns: string[] = [
    // 'id',
    'caseLabel',
    'caseStatus',
    'court',
    'resolvingDecisionLabel',
    'actions',
  ];
  public dataSource = new MatTableDataSource<CourtCaseDto>();
  selection = new SelectionModel<CourtCaseDto>(true, []);

  constructor( private dialog: MatDialog,
    private tokenService: TokenService,
    private router: Router,
    private toastr: ToastrService,
    private caseService: CaseService
  ) {}

  ngOnInit(): void {
    this.fetchAllCases();
  }

  async fetchAllCases() {
    try {
      const response: any = await lastValueFrom(this.caseService.getAllCases(5));
      console.log('Fetched Data:', response);
      if (response && response.content) {
        this.dataSource.data = response.content;
        console.log('Data Source:', this.dataSource.data);
      } else {
        console.error('Invalid data format');
      }
    } catch (error: any) {
      if (error.status === 400) {
        this.showToast('error', 'Please check the data format.');
      }
      console.error('Error:', error);
    }
  }

  viewCaseDetails(caseItem: CourtCaseDto){
    console.log('Viewing details for case ID:', caseItem);
    this.dialog.open(CaseDetailsDialogComponent, {
      width: '600px',
      data: {
        caseLabel: caseItem.caseLabel,
        caseStatus: caseItem.caseStatus,
        description: caseItem.description,
        court: caseItem.court,
        decisions: caseItem.decisions,
        resolvingDecisionLabel: caseItem.resolvingDecisionLabel
      }
    });
  }

  createCase(){
    this.dialog.open(CaseCreateComponent, {
      width: '600px',
      data: {
        //TODO can pass data here
      }
    }).afterClosed().subscribe(result => {
      console.log("closed create dialog")
      this.fetchAllCases();
    })
  }

  updateCase(caseItem: CourtCaseDto){
    console.log('Updating case ID:', caseItem);
    this.dialog.open(CaseUpdateDialogComponent, {
      width: '600px',
      data: {
        caseLabel: caseItem.caseLabel,
        caseStatus: caseItem.caseStatus,
        description: caseItem.description,
        court: caseItem.court,
        decisions: caseItem.decisions,
        resolvingDecisionLabel: caseItem.resolvingDecisionLabel
      }
    });
  }

  onLogout() {
    this.tokenService.token = '';
    console.log('logged off!');
    this.showToast('info', 'Succesfully logged off!');
    this.router.navigate(['']);
  }
  showToast(type: string, message: string) {
    this.toastr.showToast(type, message, 'top-right', true);
  }
}
