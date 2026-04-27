import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormSidebarInfo, FormSidebarTip } from '../../models/form-sidebar.model';
import { SubmitComponent } from '../submit/submit.component';

@Component({
  selector: 'app-form-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, SubmitComponent],
  templateUrl: './form-sidebar.component.html',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class FormSidebarComponent {
  @Input() cancelUrl: string = '/';
  @Input() isLoading: boolean = false;
  @Input() isSubmitDisabled: boolean = false;

  @Input() tips: FormSidebarTip[] = [];
  @Input() info: FormSidebarInfo[] = [];

  @Output() submit = new EventEmitter<void>();

  submitLabel = "Salvar Alterações"
  cancelLabel = "Cancelar e Voltar"

  onSubmit() {
    this.submit.emit();
  }
}
