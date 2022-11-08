import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingButtonDirective } from './loading-button.directive';
import { IgnoreEmojiIconDirective } from './ignore-emoji-icon.directive';
import { ViewListJobsDirective } from './messages-view-list-job';
import { ToggleAccordionDirective } from './toggle-accordion-directive';
import { NumbersOnlyDirective } from './numbers-only.directive';
import { DragAndDropDirective } from './drag-and-drop.directive';

@NgModule({
  declarations: [
    LoadingButtonDirective,
    IgnoreEmojiIconDirective,
    ViewListJobsDirective,
    ToggleAccordionDirective,
    NumbersOnlyDirective,
    DragAndDropDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingButtonDirective,
    ViewListJobsDirective,
    ToggleAccordionDirective,
    NumbersOnlyDirective,
    DragAndDropDirective
  ]
})
export class DirectivesModule { }
