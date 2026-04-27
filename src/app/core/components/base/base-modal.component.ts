import { ViewChild, TemplateRef, Output, EventEmitter, OnDestroy, Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Subscription } from 'rxjs';

@Component({
  template: '',

  imports: [],
})
export class BaseModal implements OnDestroy {
  @ViewChild('template', { static: false }) template: TemplateRef<any>;

  @Output() complete: EventEmitter<any>;
  @Output() close: EventEmitter<any>;

  public callback: Function;
  public callbackDestroy: Function;
  public modalRef: NgbModalRef;
  public subscriptions: Subscription;
  public load: boolean;
  public blockBackdrop: boolean = false;
  public classModal: string = '';
  public clienteId: number;

  constructor(public modalService: NgbModal) {
    this.complete = new EventEmitter<any>();
    this.close = new EventEmitter<any>();
    this.subscriptions = new Subscription();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();

    if (this.callbackDestroy) this.callbackDestroy.call(null);
  }

  public show() {
    this.modalRef = this.modalService.open(this.template, {
      backdrop: this.blockBackdrop ? 'static' : true,
      modalDialogClass: this.classModal + ' modal-dialog-centered',
      windowClass: 'fade',
    });

    if (this.callback) this.callback.call(null);
  }
}
