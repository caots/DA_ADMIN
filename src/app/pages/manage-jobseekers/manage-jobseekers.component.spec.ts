import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageJobseekersComponent } from './manage-jobseekers.component';

describe('ManageJobseekersComponent', () => {
  let component: ManageJobseekersComponent;
  let fixture: ComponentFixture<ManageJobseekersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageJobseekersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageJobseekersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
