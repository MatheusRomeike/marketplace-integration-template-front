import { ControlValueAccessor } from '@angular/forms';
import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  template: '',

  imports: [],
})
export class BaseInput implements ControlValueAccessor, OnDestroy {
  @Input() name: string;
  @Input() set value(val: any) {
    this.writeValue(val);
  }
  @Input() set disabled(val: boolean) {
    this.setDisabledState(val);
  }

  get value(): any {
    return this._value;
  }

  public _value: any;
  public _disabled: boolean;
  public subscriptions: Subscription = new Subscription();
  public callBackChangeValue: Function;
  public modelChange: boolean = true;

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onChange = (delta: any) => {};
  onTouched = (delta: any) => {};

  writeValue(obj: any): void {
    this._value = obj;
    this.onChange(obj);
    this.onTouched(obj);

    if (this.callBackChangeValue) this.callBackChangeValue(obj);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }
}
