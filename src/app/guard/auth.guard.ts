import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {

  const cookieService = inject(CookieService);


  const isLoggedIn = cookieService.get('user');
  const router = inject(Router)
  if (isLoggedIn) {

    return true;
  } else {
    cookieService.deleteAll()
    router.navigateByUrl('')
    return false;
  }


};
