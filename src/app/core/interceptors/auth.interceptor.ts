import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {

            if (
                error.status === 403 &&
                error.error?.Code === 'Auth.NotEnabled'
            ) {
                window.location.assign(`${window.location.origin}/not-enabled`);
            }

            return throwError(() => error);
        })
    );
};