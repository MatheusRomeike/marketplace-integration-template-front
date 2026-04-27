import { Component, forwardRef, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CompanyGroupsService } from '../../../features/company-groups/services/company-groups.service';
import { GetCompanyGroupsResult } from '../../../features/company-groups/models/company-groups.result';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'app-company-group-select',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule, AvatarComponent],
  templateUrl: './company-group-select.component.html',
  styleUrls: ['./company-group-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CompanyGroupSelectComponent),
      multi: true
    }
  ]
})
export class CompanyGroupSelectComponent implements OnInit, ControlValueAccessor {
  @Input() label: string = 'Grupo de Empresa';
  @Input() placeholder: string = 'Selecione um grupo';
  @Input() required: boolean = false;
  @Input() isInvalid: boolean = false;

  public groups: GetCompanyGroupsResult[] = [];
  public value: number | null = null;
  public isLoading = false;
  public isDisabled = false;

  private groupsService = inject(CompanyGroupsService);

  onChange: any = () => {};
  onTouched: any = () => {};

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups() {
    this.isLoading = true;
    this.groupsService.list().subscribe({
      next: (data) => {
        this.groups = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

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
