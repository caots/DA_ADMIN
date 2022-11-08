import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[toggleAccordionDir]'
})
export class ToggleAccordionDirective {
  constructor(private el: ElementRef) { 
  }

  @HostListener('click', ['$event.target'])
  onClick() {
    this.el.nativeElement.parentNode.classList.toggle("active");
 }
}