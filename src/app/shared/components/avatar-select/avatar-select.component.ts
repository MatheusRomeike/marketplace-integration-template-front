import { Component, EventEmitter, Output } from '@angular/core';
import { BaseModal } from '../../../core/components/base/base-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent, ImageCropperComponent, ImageTransform } from 'ngx-image-cropper';
import { SubmitComponent } from '../submit/submit.component';

@Component({
  selector: 'app-avatar-select',
  templateUrl: './avatar-select.component.html',
  styleUrl: './avatar-select.component.scss',

  imports: [ImageCropperComponent, SubmitComponent],
})
export class AvatarSelectComponent extends BaseModal {
  @Output('imagemBase64') imagemBase64: EventEmitter<string>;

  private imagem: string;
  public imageChangedEvent: Event | null = null;
  public scale: number = 1;
  public transform: ImageTransform = {
    translateUnit: 'px',
  };

  constructor(public override modalService: NgbModal) {
    super(modalService);
    this.imagemBase64 = new EventEmitter<string>();
    this.callback = () => {
      this.reset();
    };
  }

  public reset() {
    this.imagem = null;
    this.imageChangedEvent = null;
    this.scale = 1;
  }

  public zoomOut() {
    this.scale -= 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  public zoomIn() {
    this.scale += 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  public fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
  }

  public imageCropped(event: ImageCroppedEvent) {
    this.imagem = event.base64;
  }

  public confirmar() {
    if (this.imagem) this.imagemBase64.emit(this.imagem);
    this.reset();
    this.modalRef.dismiss();
  }
}
