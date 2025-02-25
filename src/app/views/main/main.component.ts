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
  MatDialogModule,
} from '@angular/material/dialog';
import { CaseUpdateDialogComponent } from '../case-update-dialog/case-update-dialog.component';
import { CaseCreateComponent } from '../case-create/case-create.component';
import { SelectionModel } from '@angular/cdk/collections';
import { PaginatorIntl } from '../../service/PaginatorIntl';
import { ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { atLeastOneFieldValidator } from '../../validators/atLeastOneFieldValidator';

@Component({
  selector: 'app-main',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCard,
    MatCardContent,
    MatMenuModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
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
  ngAfterViewInit() {}

  public dataSource = new MatTableDataSource<CourtCaseDto>();
  private cache = new Map<
    string,
    { totalElements: number; data: CourtCaseDto[] }
  >();

  searchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private tokenService: TokenService,
    private router: Router,
    private toastr: ToastrService,
    private caseService: CaseService,
    private cdr: ChangeDetectorRef
  ) {
    this.searchForm = this.fb.group({
      caseLabel: ['', []],
      courtName: ['', []]
    },
    { validators: atLeastOneFieldValidator('caseLabel', 'courtName') }
  );
  }

  totalElements = 0;
  pageSize = 4;
  currentPage = 0;
  isSearchActive: boolean = false;

  ngAfterView(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.fetchAllCases(0, this.pageSize);
  }

  onPaginateChange(event: PageEvent) {
    this.fetchAllCases(event.pageIndex, event.pageSize);
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onSearchClick() {
    if (this.isSearchActive) {
      this.resetSearch();
    } else {
      this.runAdvancedSearch();
    }
  }

  runAdvancedSearch() {
    if (this.searchForm.valid) {
      this.cache.clear();
      this.dataSource.data = [];
      const caseLabel = this.searchForm.get('caseLabel')?.value;
      const courtName = this.searchForm.get('courtName')?.value;

      this.fetcByFilter(this.currentPage, this.pageSize, false, caseLabel, courtName);
      this.isSearchActive = true;
    }
  }

  resetSearch() {
    this.searchForm.reset();
    this.cache.clear();
    this.dataSource.data = [];

    this.fetchAllCases(this.currentPage, this.pageSize);

    this.isSearchActive = false;
  }

  async fetcByFilter(page: number, size: number, isDesc: boolean, caseLabel: string, courtName: string) {
    const cacheKey = `${page}-${size}`;
    if (this.cache.has(cacheKey)) {
      console.log(`Using cached data for page: ${page}, size: ${size}`);
      const cachedData = this.cache.get(cacheKey);
      if (cachedData) {
        this.totalElements = cachedData.totalElements;
        this.dataSource.data = [...cachedData.data];
        this.cdr.detectChanges();
      }
      return;
    }
    try {
      console.log(
        `🚀 Fetching data from backend for page: ${page}, size: ${size}`
      );
      const response: any = await lastValueFrom(
        this.caseService.filterCases(page, size, isDesc, caseLabel, courtName)
      );

      if(response.totalElements === 0){
        this.showToast('info', 'Could not find')
      }

      if (response && response.content) {
        console.log(response);
        this.totalElements = response.totalElements;
        this.dataSource.data = [...response.content];
        this.cdr.detectChanges();
        this.cache.set(cacheKey, {
          totalElements: response.totalElements,
          data: response.content,
        });
      } else {
        console.error('Invalid data format');
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
    }
  }

  async fetchAllCases(page: number, size: number) {
    const cacheKey = `${page}-${size}`;
    if (this.cache.has(cacheKey)) {
      console.log(`Using cached data for page: ${page}, size: ${size}`);
      const cachedData = this.cache.get(cacheKey);
      if (cachedData) {
        this.totalElements = cachedData.totalElements;
        this.dataSource.data = [...cachedData.data];
        this.cdr.detectChanges();
      }
      return;
    }
    try {
      console.log(
        `🚀 Fetching data from backend for page: ${page}, size: ${size}`
      );
      const response: any = await lastValueFrom(
        this.caseService.getAllCases(page, size)
      );

      if (response && response.content) {
        console.log(response);
        this.totalElements = response.totalElements;
        this.dataSource.data = [...response.content];
        this.cdr.detectChanges();
        this.cache.set(cacheKey, {
          totalElements: response.totalElements,
          data: response.content,
        });
      } else {
        console.error('Invalid data format');
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
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
        this.cache.clear();
        this.fetchAllCases(this.currentPage, this.pageSize);
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
        if(this.isSearchActive){
          return;
        }
        this.cache.clear();
        this.fetchAllCases(this.currentPage, this.pageSize);
      });
  }

  mapStatus(option: string): string {
    if (option === 'IN_PROGRESS') {
      return 'In progress';
    } else {
      return 'Solved';
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
