import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './empty-state.component.html',
})
export class EmptyStateComponent {
  @Input() icon: string = 'ti-search';
  @Input() title: string = 'Nenhum registro encontrado';
  @Input() description: string = 'Não encontramos informações para exibir no momento.';
  @Input() buttonText: string = 'Adicionar Novo';
  @Input() buttonLink: string | any[] = null;
  @Input() showButton: boolean = true;
  @Input() buttonIcon: string = 'ti-plus';

  @Output() buttonClick = new EventEmitter<void>();

  onButtonClick() {
    this.buttonClick.emit();
  }
}
