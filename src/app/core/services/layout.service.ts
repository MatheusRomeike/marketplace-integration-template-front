import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  public menuCollapsed: boolean = false;
  public menuHover: boolean = false;
  public titulo$: Subject<{ nome: string, pathRetorno: string }>;

  constructor() {
    this.titulo$ = new Subject<{ nome: string, pathRetorno: string }>();
  }

  public menuEnter() {
    if (document.querySelector("html")?.classList.contains('layout-menu-collapsed')) {
      this.menuHover = true;
      if (!document.querySelector("html")?.classList.contains('layout-menu-hover')) {
        document.querySelector("html")?.classList.add('layout-menu-hover');
        document.querySelector(".layout-menu-toggle")?.classList.add('d-block');
      }
    }
  }

  public menuLeave() {
    this.menuHover = false;
    if (document.querySelector("html")?.classList.contains('layout-menu-collapsed') &&
      document.querySelector("html")?.classList.contains('layout-menu-hover')) {
      document.querySelector("html")?.classList.remove('layout-menu-hover');
      document.querySelector(".layout-menu-toggle")?.classList.remove('d-block');
    }
  }

  public menuToggle() {
    this.menuCollapsed = !this.menuCollapsed;
    this.menuHover = false;
    document.querySelector("html")?.classList.toggle('layout-menu-collapsed');
    document.querySelector("html")?.classList.remove('layout-menu-hover');
  }
}
