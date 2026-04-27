import {
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationService } from '../../services/navigation.service';
import { NavSection } from '../../configs/navigation.config';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navbar-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar-search.component.html',
  styleUrl: './navbar-search.component.scss',
})
export class NavbarSearchComponent implements OnInit {
  @ViewChild('searchModal') private searchModal!: TemplateRef<unknown>;

  private readonly modalService = inject(NgbModal);
  private readonly navigationService = inject(NavigationService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private modalRef?: NgbModalRef;

  query = '';
  allSections: NavSection[] = [];
  filteredSections: NavSection[] = [];

  ngOnInit() {
    this.allSections = this.navigationService.getSearchableItems();
    this.filteredSections = this.allSections;
  }


  open() {
    this.query = '';
    this.filteredSections = this.allSections;
    this.modalRef = this.modalService.open(this.searchModal, {
      centered: false,
      size: 'lg',
      scrollable: false,
    });
    setTimeout(() => this.cdr.detectChanges());
  }

  close() {
    this.modalRef?.dismiss();
  }

  onQueryChange() {
    const q = this.query.toLowerCase().trim();
    if (!q) {
      this.filteredSections = this.allSections;
    } else {
      this.filteredSections = this.allSections
        .map((s) => ({
          ...s,
          items: s.items.filter(
            (item) =>
              item.title.toLowerCase().includes(q) ||
              item.url.toLowerCase().includes(q)
          ),
        }))
        .filter((s) => s.items.length > 0);
    }

    this.cdr.detectChanges();
  }

  navigate(url: string) {
    this.close();
    this.router.navigateByUrl(url);
  }

  get noResults(): boolean {
    return !!this.query.trim() && this.filteredSections.length === 0;
  }

  @HostListener('document:keydown', ['$event'])
  onCtrlK(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.open();
    }
  }
}
