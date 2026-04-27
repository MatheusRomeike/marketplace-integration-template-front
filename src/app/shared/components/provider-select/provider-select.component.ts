import { Component, forwardRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AvatarComponent } from '../avatar/avatar.component';
import { AVAILABLE_PROVIDERS } from '../../constants/provider.constants';

@Component({
  selector: 'app-provider-select',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule, AvatarComponent],
  templateUrl: './provider-select.component.html',
  styleUrls: ['./provider-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProviderSelectComponent),
      multi: true
    }
  ]
})
export class ProviderSelectComponent implements ControlValueAccessor {
  @Input() label: string = 'Provedor';
  @Input() placeholder: string = 'Selecione um provedor';
  @Input() required: boolean = false;
  @Input() isInvalid: boolean = false;

  public providers = AVAILABLE_PROVIDERS;

  public value: number | null = null;
  public isDisabled = false;

  onChange: any = () => { };
  onTouched: any = () => { };

  writeValue(value: number): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onModelChange(value: number) {
    this.value = value;
    this.onChange(value);
  }
}
