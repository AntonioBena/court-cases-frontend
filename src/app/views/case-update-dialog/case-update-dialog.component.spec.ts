import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseUpdateDialogComponent } from './case-update-dialog.component';

describe('CaseUpdateDialogComponent', () => {
  let component: CaseUpdateDialogComponent;
  let fixture: ComponentFixture<CaseUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseUpdateDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
