import { Component, ViewChild } from '@angular/core';

import { LayoutService } from '../../services/layout.service';
import { BaseComponent } from '../base/base.component';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { RouterModule } from '@angular/router';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarSearchComponent } from '../navbar-search/navbar-search.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [RouterModule, AvatarComponent, NgbDropdownModule, NavbarSearchComponent],
})
export class NavbarComponent extends BaseComponent {
  public pathRedirect: string = '/home';
  public titulo: string = '';
  public nomeUsuario: string = '';
  public avatarUsuario: string = '';

  @ViewChild(NavbarSearchComponent) searchComponent!: NavbarSearchComponent;

  constructor(
    private layoutService: LayoutService,
    private localStorageService: LocalStorageService
  ) {
    super();

    this.nomeUsuario = this.localStorageService.getSession()?.name || '';

    this.subscriptions.add(
      this.layoutService.titulo$.subscribe((p) => {
        this.titulo = p.nome;
        this.pathRedirect = p.pathRetorno;
      })
    );
  }

  openSearch() {
    this.searchComponent?.open();
  }

  public sair() {
    this.localStorageService.logout();
  }
}
