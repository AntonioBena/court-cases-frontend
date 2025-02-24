import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { CaseDetailsDialogComponent } from '../case-details-dialog/case-details-dialog.component';

import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
} from '@angular/material/dialog';
import { CaseUpdateDialogComponent } from '../case-update-dialog/case-update-dialog.component';
import { CaseCreateComponent } from '../case-create/case-create.component';
import { SelectionModel } from '@angular/cdk/collections';
import { PaginatorIntl } from '../../service/PaginatorIntl';

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
    MatMenuModule,
  ],
  providers: [
    {provide: MatPaginatorIntl, useClass: PaginatorIntl}
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  displayedColumns: string[] = [
    'caseLabel',
    'caseStatus',
    'court',
    'resolvingDecisionLabel',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
  }

  public dataSource = new MatTableDataSource<CourtCaseDto>();
  dataSourceWithPageSize = new MatTableDataSource(this.dataSource.data);
  selection = new SelectionModel<CourtCaseDto>(true, []);

  constructor(
    private dialog: MatDialog,
    private tokenService: TokenService,
    private router: Router,
    private toastr: ToastrService,
    private caseService: CaseService
  ) {
  }


  ngOnInit(): void {
    this.fetchAllCases(0, 5);
  }

  currentPage=0;

  onPaginateChange(event: any) {
this.currentPage = event.pageIndex;

   const pageIndex = event.pageIndex;
     const pageSize = event.pageSize;

    // console.log(`Navigating to Page: ${pageIndex}, Page Size: ${pageSize}`);

    // this.fetchAllCases(pageIndex, pageSize);
  }

async fetchAllCases(page: number, size: number) {
  try {
    const response: any = await lastValueFrom(this.caseService.getAllCases(page, size));
    console.log("resp" + JSON.stringify(response));
    if (response && response.content) {
      this.dataSource.data = response.content;
      console.log(`Paginator Updated: totalElements=${response.totalElements}, pageIndex=${response.number}`);
      this.dataSource._updateChangeSubscription();

      this.dataSource.paginator = this.paginator;

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

  viewCaseDetails(caseItem: CourtCaseDto) {
    console.log('Updating case ID:', caseItem);
    this.dialog.open(CaseUpdateDialogComponent, {
      width: 'auto',
      maxWidth: 'none',
      data: {
        id: caseItem.id,
        caseLabel: caseItem.caseLabel,
        caseStatus: caseItem.caseStatus,
        description: caseItem.description,
        court: caseItem.court,
        decisions: caseItem.decisions,
        resolvingDecisionLabel: caseItem.resolvingDecisionLabel,
        isEdit: false
      },
    }).afterClosed().subscribe(()=> {
    })
  }

  createCase() {
    this.dialog
      .open(CaseCreateComponent, {
        width: '600px',
        data: {
          //TODO can pass data here
        },
      })
      .afterClosed()
      .subscribe((result) => {
        console.log('closed create dialog');
        this.fetchAllCases(0, 10);
      });
  }

  updateCase(caseItem: CourtCaseDto) {
    console.log('Updating case ID:', caseItem);
    this.dialog.open(CaseUpdateDialogComponent, {
      width: 'auto',
      maxWidth: 'none',
      data: {
        id: caseItem.id,
        caseLabel: caseItem.caseLabel,
        caseStatus: caseItem.caseStatus,
        description: caseItem.description,
        court: caseItem.court,
        decisions: caseItem.decisions,
        resolvingDecisionLabel: caseItem.resolvingDecisionLabel,
        isEdit: true
      },
    }).afterClosed().subscribe(()=> {
      this.fetchAllCases(0, 10);
    })
  }

  mapStatus(option: string): string{
    if(option === 'IN_PROGRESS'){
      return 'In progress'
    }else{
      return 'Solved'
    }
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
