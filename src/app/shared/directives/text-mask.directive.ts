import { Directive, ElementRef, Input, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

declare var vanillaTextMask: any;

@Directive({
  selector: '[appTextMask]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextMaskDirective),
      multi: true,
    },
  ],
})
export class TextMaskDirective implements ControlValueAccessor, OnInit, OnDestroy {
  private _vanillaTextMask: any;
  private mask!: Array<string | RegExp>;

  private onChange = (_: any) => { };
  private onTouched = () => { };

  private inputListener!: (event: Event) => void;

  constructor(private el: ElementRef<HTMLInputElement>) { }

  // =========================
  // Input da máscara
  // =========================
  @Input()
  set appTextMask(mask: Array<string | RegExp>) {
    this.mask = mask;

    if (this._vanillaTextMask) {
      this.applyMask();
      this.updateMask();
    }
  }

  // =========================
  // Lifecycle
  // =========================
  ngOnInit(): void {
    this.applyMask();
  }

  ngOnDestroy(): void {
    if (this.inputListener) {
      this.el.nativeElement.removeEventListener('input', this.inputListener);
    }
  }

  // =========================
  // Core
  // =========================
  private applyMask(): void {
    if (!this.mask) return;

    this._vanillaTextMask = vanillaTextMask.maskInput({
      inputElement: this.el.nativeElement,
      mask: this.mask,
      guide: false,
    });
  }

  private updateMask(): void {
    const input = this.el.nativeElement;
    if (this._vanillaTextMask?.textMaskInputElement) {
      this._vanillaTextMask.textMaskInputElement.update(input.value);
    }
  }

  private unmask(value: string): string {
    return value ? value.replace(/\D+/g, '') : '';
  }

  // =========================
  // ControlValueAccessor
  // =========================
  writeValue(value: any): void {
    const input = this.el.nativeElement;
    input.value = value || '';
    this.updateMask();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;

    this.inputListener = (event: Event) => {
      const value = (event.target as HTMLInputElement).value;
      this.onChange(this.unmask(value));
    };

    this.el.nativeElement.addEventListener('input', this.inputListener);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
    this.el.nativeElement.addEventListener('blur', () => this.onTouched());
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }
}
