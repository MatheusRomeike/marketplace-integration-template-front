import { Injectable } from '@angular/core';

declare var Toasty: any;
declare var Swal: any;

@Injectable({
    providedIn: 'root'
})
export class NotifyService {

    private toasty: any;

    constructor() {
        this.toasty = new Toasty({
            transition: "fade",
            insertBefore: true,
            duration: 4000,
            enableSounds: false,
            autoClose: true,
            progressBar: true,
            prependTo: document.body.childNodes[0]
        });
    }

    public info(message: string) {
        this.toasty.info(message);
    }

    public success(message: string) {
        this.toasty.success(message);
    }

    public warning(message: string) {
        this.toasty.warning(message);
    }

    public error(message: string) {
        this.toasty.error(message);
    }

    public confirmation(title: string, text: string): Promise<any> {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: 'btn btn-primary me-3 waves-effect waves-light',
                cancelButton: 'btn btn-label-secondary waves-effect waves-light'
            },
            buttonsStyling: false,
            showCloseButton: true,
            showClass: {
                popup: 'animate__animated animate__zoomIn animate__faster'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOut animate__faster'
            }
        })
    }

    public confirmationSuccess(title: string, text: string): Promise<any> {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Confirmar',
            customClass: {
                confirmButton: 'btn btn-primary waves-effect waves-light'
            },
            buttonsStyling: false,
            showClass: {
                popup: 'animate__animated animate__zoomIn animate__faster'
            }
        })
    }

    public alertSound() {
        var snd = new Audio("../../../assets/audio/note.mp3");
        setTimeout(() => {
            snd.play();
        }, 100);
    }
}