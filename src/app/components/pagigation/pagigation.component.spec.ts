import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagigationComponent } from './pagigation.component';

describe('PagigationComponent', () => {
  let component: PagigationComponent;
  let fixture: ComponentFixture<PagigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
