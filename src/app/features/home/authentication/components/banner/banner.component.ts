import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogoComponent } from '../../../../../shared/components/logo/logo.component';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule, LogoComponent],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss'
})
export class BannerComponent { }
