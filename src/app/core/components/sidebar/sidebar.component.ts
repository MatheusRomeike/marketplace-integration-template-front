import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import { LayoutService } from '../../services/layout.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { BaseComponent } from '../base/base.component';
import { CommonModule } from '@angular/common';
import { CompanySelectComponent } from '../../../shared/components/company-select/company-select.component';
import { RouterModule } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { AvatarComponent } from "../../../shared/components/avatar/avatar.component";
import { LogoComponent } from '../../../shared/components/logo/logo.component';

declare var Menu: any;

declare var window: any;
declare var Helpers: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  imports: [CommonModule, CompanySelectComponent, RouterModule, LogoComponent],
})
export class SidebarComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('asideElement', { static: true }) asideElement: ElementRef;

  public usuarioNome: string;
  public empresaNome: string;
  public empresaLogoMarca: string
  public organizacaoChevron: boolean;

  public menuItems: any[] = [];

  constructor(
    public layoutService: LayoutService,
    public localStorageService: LocalStorageService,
    private navigationService: NavigationService
  ) {

    super();
    this.inicializar();
    this.menuItems = this.navigationService.getVisibleSections();
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      let animate,
        isHorizontalLayout = false;
      var templateName = document.documentElement.getAttribute('data-template');

      if (document.getElementById('layout-menu')) {
        isHorizontalLayout = document
          .getElementById('layout-menu')
          .classList.contains('menu-horizontal');
      }

      let layoutMenuEl = document.querySelectorAll('#layout-menu');
      layoutMenuEl.forEach(function (element) {
        var menu = new Menu(element, {
          orientation: isHorizontalLayout ? 'horizontal' : 'vertical',
          closeChildren: isHorizontalLayout ? true : false,

          showDropdownOnHover: localStorage.getItem(
            'templateCustomizer-' + templateName + '--ShowDropdownOnHover'
          ) // If value(showDropdownOnHover) is set in local storage
            ? localStorage.getItem(
              'templateCustomizer-' + templateName + '--ShowDropdownOnHover'
            ) === 'true' // Use the local storage value
            : window.templateCustomizer !== undefined // If value is set in config.js
              ? window.templateCustomizer.settings.defaultShowDropdownOnHover // Use the config.js value
              : true,
        });

        window.Helpers.scrollToActive((animate = false));
        window.Helpers.mainMenu = menu;
      });

      let menuToggler = document.querySelectorAll('.layout-menu-toggle');
      menuToggler.forEach((item) => {
        item.addEventListener('click', (event) => {
          event.preventDefault();
          window.Helpers.toggleCollapsed();
          if (true && !window.Helpers.isSmallScreen()) {
            try {
              localStorage.setItem(
                'templateCustomizer-' + templateName + '--LayoutCollapsed',
                String(window.Helpers.isCollapsed())
              );
              let layoutCollapsedCustomizerOptions = document.querySelector(
                '.template-customizer-layouts-options'
              );
              if (layoutCollapsedCustomizerOptions) {
                let layoutCollapsedVal = window.Helpers.isCollapsed() ? 'collapsed' : 'expanded';
                (
                  layoutCollapsedCustomizerOptions.querySelector(
                    `input[value="${layoutCollapsedVal}"]`
                  ) as any
                ).click();
              }
            } catch (e) { }
          }
        });
      });
      let delay = (elem: any, callback: any) => {
        let timeout = null as any;
        elem.onmouseenter = function () {
          if (!Helpers.isSmallScreen()) {
            timeout = setTimeout(callback, 300);
          } else {
            timeout = setTimeout(callback, 0);
          }
        };

        elem.onmouseleave = function () {
          document.querySelector('.layout-menu-toggle').classList.remove('d-block');
          clearTimeout(timeout);
        };
      };
      if (document.getElementById('layout-menu')) {
        delay(document.getElementById('layout-menu'), function () {
          if (!Helpers.isSmallScreen()) {
            document.querySelector('.layout-menu-toggle').classList.add('d-block');
          }
        });
      }
    }, 200);
  }

  ngOnInit(): void {
    setTimeout(() => {
      new PerfectScrollbar('#menu-sistem', {
        wheelSpeed: 2,
        wheelPropagation: true,
        minScrollbarLength: 20,
      });
    }, 500);
  }

  private inicializar() {
    const user = this.localStorageService.getSession();
    this.usuarioNome = user?.name || '';
  }

  public sair() {
    this.localStorageService.logout();
  }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.asideElement.nativeElement.contains(event.target);
    if (!clickedInside) {
      document.querySelector('html').classList.remove('layout-menu-expanded');
    }
  }
}
