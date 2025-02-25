import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem("token");

  //console.log("token from local storage is= " + token);

  const router = inject(Router);

  // Only intercept requests to the specific API endpoint
  if (!req.url.startsWith('http://localhost:8080/api/v1/auth')) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log("Unauthorized request, redirecting to login...");
          localStorage.removeItem("token");
          router.navigate(['']);
        }
        return throwError(() => error);
      })
    );
  }
  return next(req);
};

