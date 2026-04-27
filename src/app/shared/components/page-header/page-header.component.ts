import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface Breadcrumb {
  label: string;
  url?: string;
  active?: boolean;
}

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() breadcrumbs: Breadcrumb[] = [];

  @Input() showBack: boolean = true;
  @Input() backUrl: string = '/';
  @Input() backLabel: string = 'Voltar';

  @Input() showSave: boolean = true;
  @Input() saveLabel: string = 'Salvar';
  @Input() saveIcon: string = 'bx bx-rocket';
  @Input() saveUrl: string | any[] = '';
  @Input() isLoading: boolean = false;
  @Input() isSaveDisabled: boolean = false;

  @Output() save = new EventEmitter<void>();

  onSave() {
    if (!this.saveUrl) {
      this.save.emit();
    }
  }
}
