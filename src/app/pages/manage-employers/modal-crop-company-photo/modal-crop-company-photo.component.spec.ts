import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCropCompanyPhotoComponent } from './modal-crop-company-photo.component';

describe('ModalCropCompanyPhotoComponent', () => {
  let component: ModalCropCompanyPhotoComponent;
  let fixture: ComponentFixture<ModalCropCompanyPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCropCompanyPhotoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCropCompanyPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
