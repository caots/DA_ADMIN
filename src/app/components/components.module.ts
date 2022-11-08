import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NbMomentDateModule } from '@nebular/moment';
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
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { DirectivesModule } from '../directives/directives.module';
import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component';
import { PagigationComponent } from './pagigation/pagigation.component';

@NgModule({
  declarations: [
    ModalConfirmComponent,
    PagigationComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    NbIconModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    NbMenuModule,
    NbCardModule,
    NbMomentDateModule,
    NbSelectModule,
    NbInputModule,
    NbIconModule,
    NgSelectModule,
    NbButtonModule,
    NbContextMenuModule,
    NbFormFieldModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbLayoutModule,
    NbTooltipModule,
    NbTreeGridModule,
    NbSpinnerModule,
    NbDialogModule,
    NbAutocompleteModule,
    NbToggleModule,
    DirectivesModule,
    NgxSkeletonLoaderModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  exports: [
    ModalConfirmComponent,
    PagigationComponent,
  ]
})

export class ComponentsModule { }
