import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[viewListJobs]'
})
export class ViewListJobsDirective {
  constructor(private el: ElementRef) { 
  }

  @HostListener('click', ['$event.target'])
  onClick() {
    this.el.nativeElement.parentNode.classList.toggle("active");
 }
}