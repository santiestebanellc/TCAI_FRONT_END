import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login-service/login.service';

export const isLoggedGuard = () => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (loginService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
