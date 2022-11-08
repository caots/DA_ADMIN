import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobseekerDetailsComponent } from './jobseeker-details.component';

describe('JobseekerDetailsComponent', () => {
  let component: JobseekerDetailsComponent;
  let fixture: ComponentFixture<JobseekerDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobseekerDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobseekerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
