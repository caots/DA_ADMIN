import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageJobPostingsComponent } from './manage-job-postings.component';

describe('ManageJobPostingsComponent', () => {
  let component: ManageJobPostingsComponent;
  let fixture: ComponentFixture<ManageJobPostingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageJobPostingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageJobPostingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
