import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss'],

  imports: [CommonModule],
})
export class SubmitComponent {
  @Input() submitClass: string;
  @Input() disabled: boolean;
  @Input() inLoad: boolean;
  @Input() text: string;
  @Input() icon: string;

  constructor() {
    this.submitClass = 'btn btn-primary waves-effect';
    this.text = 'Salvar';
  }
}
