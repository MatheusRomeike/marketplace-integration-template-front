import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',

  imports: [],
})
export class FooterComponent {
  public ano: number = new Date().getFullYear();
}
