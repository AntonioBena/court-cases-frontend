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
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';

import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
} from '@angular/material/dialog';
import { CaseUpdateDialogComponent } from '../case-update-dialog/case-update-dialog.component';
import { CaseCreateComponent } from '../case-create/case-create.component';
import { SelectionModel } from '@angular/cdk/collections';
import { PaginatorIntl } from '../../service/PaginatorIntl';
import { ChangeDetectorRef } from '@angular/core';

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
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntl }],
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
  ) {}

  totalElements = 0;
  pageSize = 3;
  loadedPages = new Map<number, any[]>();

  ngAfterView(): void{
    this.dataSource.paginator = this.paginator;
  }


  ngOnInit(): void {
    this.fetchAllCases(0, this.pageSize);
  }

  updateTableData() {
    let allData: any[] = [];
  this.loadedPages.forEach((data) => {
    allData = [...allData, ...data];
  });
   this.dataSource.data = allData;
}

  onPaginateChange(event: PageEvent) {
    this.fetchAllCases(event.pageIndex, this.pageSize);
  }

  async fetchAllCases(page: number, size: number) {
   if (this.loadedPages.has(page)) {
     this.updateTableData();
      return;
    }
    try {
      const response: any = await lastValueFrom(
        this.caseService.getAllCases(page, size)
      );
      if (response && response.content) {
        console.log(response)
        this.loadedPages.set(page, response.content);
        this.totalElements = response.totalElements;
         this.updateTableData();
      } else {
        console.error("Invalid data format");
      }
    } catch (error: any) {
      console.error("Error:", error);
    }
  }

  async fetchCasesByFilter(page: number, size: number, isDesc: boolean, caseLabel: string, courtName: string){
    try{
      const response: any = await lastValueFrom(
        this.caseService.filterCases(page, size, isDesc, caseLabel, courtName)
      );
      console.log(JSON.stringify(response));
      if (response && response.content){

      }else {
        console.error('Invalid data format');
      }
    }catch (error: any) {
      if (error.status === 400) {
        this.showToast('error', 'Please check the data format.');
      }
      console.error('Error:', error);
    }
  }

  viewCaseDetails(caseItem: CourtCaseDto) {
    console.log('Updating case ID:', caseItem);
    this.dialog
      .open(CaseUpdateDialogComponent, {
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
          isEdit: false,
        },
      })
      .afterClosed()
      .subscribe(() => {});
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
    this.dialog
      .open(CaseUpdateDialogComponent, {
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
          isEdit: true,
        },
      })
      .afterClosed()
      .subscribe(() => {
        this.fetchAllCases(0, 10);
      });
  }

  mapStatus(option: string): string {
    if (option === 'IN_PROGRESS') {
      return 'In progress';
    } else {
      return 'Solved';
    }
  }

  advancedSearch(){

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
