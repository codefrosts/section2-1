import {Directive, HostListener} from '@angular/core';
import {FormControlName} from '@angular/forms';
import {isNumeric} from 'rxjs/internal-compatibility';

@Directive({
  selector: 'input[formControlName][appOnlyNumber]'
})
export class OnlyNumberDirective {

  constructor(private formControlName: FormControlName) {
  }

  @HostListener('ngModelChange', ['$event']) onNgModelChange(value): void {
    if (!isNumeric(value) && !(value === '-')) {
      const subStr = value.substring(0, value.length - 1);
      if (subStr !== '-') {
        this.setValue(subStr === '' ? null : Number(subStr));
      }
    } else {
      if (value !== '-' && value[value.length - 1] !== '.') {
        this.setValue(Number(value));
      }
    }
  }

  setValue(value: any): void {
    this.formControlName.control.setValue(value, {emitViewToModelChange: false});
  }

}
