import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from "@angular/forms";

@Directive({
  selector: '[ngxNumbersOnly]'
})
export class NumbersOnlyDirective {

  @Input() isFormatNumber: boolean = false;
  constructor(
    private el: ElementRef,
    private control: NgControl
  ) {}

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this.el.nativeElement.value;
    let replaceValue = initalValue.replace(/[^0-9.]*/g, '');
    if (hasDuplicateDot(replaceValue)) {
      replaceValue = removeDot(replaceValue);
    }
    if (this.isFormatNumber) {
      replaceValue = numberWithCommas(replaceValue)
    }
    this.el.nativeElement.value = replaceValue;
    if (initalValue !== replaceValue) {
      this.control.control.setValue(replaceValue);
      event.stopPropagation();
    }
  }
}

const numberWithCommas = (x) => {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

const hasDuplicateDot = (val: string): boolean => {
  if (val && val.includes('.')) {
    let numberDot = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] == '.') {
        ++numberDot;
      }
    }

    return numberDot >= 2;
  }

  return false;
}

const removeDot = (val: string): string => {
  let result = '';
  for (let i = 0; i < val.length; i++) {
    if (val[i] != '.' || !result.includes('.')) {
      result += val[i];
    }
  }

  return result;
}
