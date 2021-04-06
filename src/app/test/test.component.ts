import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {isNumeric} from 'rxjs/internal-compatibility';
import {debounceTime, filter} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit, OnDestroy {
  options = [
    {label: 'isPrime', value: 'isPrime'},
    {label: 'isFibonacci', value: 'isFibonacci'},
  ];
  form: FormGroup;
  subscription = new Subscription();

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.initForm();
    this.checkNumber();
  }

  initForm(): void {
    this.form = this.fb.group({
      data: [null],
      option: ['isPrime'],
      result: [null]
    });
  }

  checkNumber(): void {
    this.subscription.add(
      this.form.get('data').valueChanges.pipe(
        debounceTime(300),
        filter(value => isNumeric(value))
      ).subscribe(value => {
        value = Number(value);
        if (value < 0) {
          this.form.get('number').setValue(1);
        } else if (!Number.isInteger(value)) {
          this.form.get('number').setValue(Math.round(value));
        }
        this.checkResult();
      })
    );
  }

  checkOption(): void {
    this.subscription.add(
      this.form.get('option').valueChanges.subscribe(_ => this.checkResult())
    );
  }

  checkResult(): void {
    const {data, option} = this.form.getRawValue();
    this.form.get('result').setValue(option === 'isPrime' ? this.isPrime(data) : this.isFibonacci(data));
  }

  isPrime(value: number): boolean {
    let isPrime = true;
    for (let i = 2; i < value; i++) {
      if (value % i === 0) {
        isPrime = false;
        break;
      }
    }
    return isPrime;
  }

  isFibonacci(query, cur = 1, last = 0): boolean {
    if (cur < query) {
      return this.isFibonacci(query, cur + last, cur);
    }
    return cur === query;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
