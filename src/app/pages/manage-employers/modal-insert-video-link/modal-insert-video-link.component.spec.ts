import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInsertVideoLinkComponent } from './modal-insert-video-link.component';

describe('ModalInsertVideoLinkComponent', () => {
  let component: ModalInsertVideoLinkComponent;
  let fixture: ComponentFixture<ModalInsertVideoLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalInsertVideoLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInsertVideoLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
