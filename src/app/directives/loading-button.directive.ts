import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[ngxLoadingButton]'
})

export class LoadingButtonDirective {
  @Input() loading: boolean;
  btnContent: string;
  constructor(private el: ElementRef) {

  }
  ngAfterViewInit() {
    this.btnContent = this.el.nativeElement.outerText;
  }

  ngOnChanges() {
    if (this.btnContent) {
      this.el.nativeElement.disabled = this.loading;
      if (this.loading) {
        this.el.nativeElement.innerHTML = '';
        this.el.nativeElement.insertAdjacentHTML('beforeend', '<div class="spinner-border icon-loading-custom" role="status" style="width: 20px; height: 20px"></div>');
      } else {
        this.el.nativeElement.innerHTML = this.btnContent;
      }
    }
  }
}
