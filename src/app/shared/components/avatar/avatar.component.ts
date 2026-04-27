import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, input, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',

  imports: [CommonModule],
})
export class AvatarComponent {
  @Input('nome') nome: string;
  @Input('url') url: string;
  @Input('avatarClass') avatarClass: string;
  @Input('scaleGray') scaleGray: boolean;
  @Input('size') size: string = 'avatar-md';
  @Input('circle') circle: boolean;
  @Input('status') status: 'online' | 'away' | 'busy' | 'offline' | string;

  public avatarDefault() {
    return (this.nome || '').substring(0, 2).toUpperCase();
  }

  public colorAvatar(): string {
    if (this.scaleGray) {
      return `bg-label-secondary ${this.avatarClass}`;
    }

    const colors = ['primary', 'info', 'success', 'warning', 'danger', 'dark'];

    const inicial = (this.nome || 'A').charCodeAt(0);
    const color = colors[inicial % colors.length];

    return `bg-label-${color} ${this.avatarClass}`;
  }
}
