import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss']
})
export class SectionHeaderComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() icon: string = 'bx-cog';
  @Input() colorClass: string = 'primary';
  
  // Botão opcional
  @Input() btnLabel: string = '';
  @Input() btnIcon: string = 'bx-plus';
  @Input() btnClass: string = 'btn-primary';
  
  @Output() btnAction = new EventEmitter<void>();

  onBtnClick() {
    this.btnAction.emit();
  }
}
