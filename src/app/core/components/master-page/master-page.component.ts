import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-master-page',
  templateUrl: './master-page.component.html',
  styleUrl: './master-page.component.scss',

  imports: [SidebarComponent, NavbarComponent, RouterModule],
})
export class MasterPageComponent {
  constructor(private localStorageService: LocalStorageService) {}
}
