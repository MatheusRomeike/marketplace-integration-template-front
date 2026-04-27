import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { Router } from "@angular/router";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 403) {
        const apiError = error.error?.errors?.[0] || error.error?.Errors?.[0];

        if (apiError?.code === 'User.NotRegistered') {
          window.location.assign(`${window.location.origin}/not-enabled`);
        }
      }

      return throwError(() => error);
    })
  );
};