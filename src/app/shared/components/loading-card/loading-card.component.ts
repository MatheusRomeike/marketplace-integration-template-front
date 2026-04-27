import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-card',
  standalone: true,
  templateUrl: './loading-card.component.html'
})
export class LoadingCardComponent {
  @Input() message = 'Carregando...';
}
