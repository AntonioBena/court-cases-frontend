import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcivateComponent } from './acivate.component';

describe('AcivateComponent', () => {
  let component: AcivateComponent;
  let fixture: ComponentFixture<AcivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcivateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
