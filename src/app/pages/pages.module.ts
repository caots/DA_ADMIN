import { LY_THEME, LY_THEME_NAME, LyTheme2, StyleRenderer } from '@alyle/ui';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { MinimaDark, MinimaLight } from '@alyle/ui/themes/minima';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbAutocompleteModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbContextMenuModule,
  NbDatepickerModule,
  NbDialogModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbMenuModule,
  NbSelectModule,
  NbSpinnerModule,
  NbToggleModule,
  NbTooltipModule,
  NbTreeGridModule,
} from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgImageSliderModule } from 'ng-image-slider';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { ThemeModule } from '../@theme/theme.module';
import { ComponentsModule } from '../components/components.module';
import { DirectivesModule } from '../directives/directives.module';
import { EmployerDetailsComponent } from './manage-employers/employer-details/employer-details.component';
import { ManageEmployersComponent } from './manage-employers/manage-employers.component';
import { ManageJobPostingsComponent } from './manage-job-postings/manage-job-postings.component';
import { JobPostingsDetailsComponent } from './manage-job-postings/job-postings-details/job-postings-details.component';

import {
  ModalCropCompanyPhotoComponent,
} from './manage-employers/modal-crop-company-photo/modal-crop-company-photo.component';
import { ModalInsertVideoLinkComponent } from './manage-employers/modal-insert-video-link/modal-insert-video-link.component';
import { JobseekerDetailsComponent } from './manage-jobseekers/jobseeker-details/jobseeker-details.component';
import { ManageJobseekersComponent } from './manage-jobseekers/manage-jobseekers.component';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbCardModule,
    NbInputModule,
    NbIconModule,
    NbButtonModule,
    NbSelectModule,
    NbSpinnerModule,
    NbCheckboxModule,
    NbTreeGridModule,
    NbLayoutModule,
    NbTooltipModule,
    NbDatepickerModule,
    NbContextMenuModule,
    NbDialogModule,
    NbFormFieldModule,
    Ng2SmartTableModule,
    NbAutocompleteModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    Ng2TelInputModule,
    ImageCropperModule,
    DirectivesModule,
    NgImageSliderModule,
    FontAwesomeModule,
    NgxSkeletonLoaderModule,
    NgbModule,
    LyImageCropperModule,
    ComponentsModule,
    NbToggleModule,
    NbEvaIconsModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  declarations: [
    PagesComponent,
    ManageEmployersComponent,
    EmployerDetailsComponent,
    ManageJobseekersComponent,
    JobseekerDetailsComponent,
    ManageJobPostingsComponent,
    JobPostingsDetailsComponent,
    ModalInsertVideoLinkComponent,
    ModalCropCompanyPhotoComponent,
  ],
  providers: [
    [LyTheme2],
    [StyleRenderer],
    { provide: LY_THEME_NAME, useValue: 'minima-light' },
    { provide: LY_THEME, useClass: MinimaLight, multi: true },
    { provide: LY_THEME, useClass: MinimaDark, multi: true },
  ]
})
export class PagesModule {
}
