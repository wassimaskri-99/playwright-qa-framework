import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

export interface IUser {
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface IResponse {
  isOk: boolean;
  data?: IUser | null;
  message?: string;
}

const defaultPath = '/';
export const defaultUser: IUser = {
  email: 'jheart@dx-email.com',
  name: 'John Heart',
  avatarUrl: 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/01.png',
};

// Demo account. The original template logged anyone in with any password;
// this app checks credentials so the login flow is worth testing.
export const demoCredentials = { email: defaultUser.email, password: 'password' };

const sessionKey = 'crm-user';

@Injectable()
export class AuthService {
  private router = inject(Router);
  private _user: IUser | null = this.loadSession();

  private loadSession(): IUser | null {
    const saved = sessionStorage.getItem(sessionKey);
    return saved ? (JSON.parse(saved) as IUser) : null;
  }

  get loggedIn(): boolean {
    return !!this._user;
  }

  private _lastAuthenticatedPath: string = defaultPath;

  set lastAuthenticatedPath(value: string) {
    this._lastAuthenticatedPath = value;
  }

  async logIn(email: string, password: string) {
    try {
      if (email.toLowerCase() !== demoCredentials.email || password !== demoCredentials.password) {
        return {
          isOk: false,
          message: 'Invalid email or password',
        };
      }

      this._user = { ...defaultUser };
      sessionStorage.setItem(sessionKey, JSON.stringify(this._user));
      this.router.navigate([this._lastAuthenticatedPath]);

      return {
        isOk: true,
        data: this._user,
      };
    } catch {
      return {
        isOk: false,
        message: 'Authentication failed',
      };
    }
  }

  async getUser() {
    try {
      // Send request

      return {
        isOk: true,
        data: this._user,
      };
    } catch {
      return {
        isOk: false,
        data: null,
      };
    }
  }

  async createAccount(email: string, password: string) {
    try {
      // Send request

      this.router.navigate(['/auth/register']);
      return {
        isOk: true,
      };
    } catch {
      return {
        isOk: false,
        message: 'Failed to create account',
      };
    }
  }

  async changePassword(email: string, recoveryCode: string) {
    try {
      // Send request

      return {
        isOk: true,
      };
    } catch {
      return {
        isOk: false,
        message: 'Failed to change password',
      };
    }
  }

  async resetPassword(email: string) {
    try {
      // Send request

      return {
        isOk: true,
      };
    } catch {
      return {
        isOk: false,
        message: 'Failed to reset password',
      };
    }
  }

  async logOut() {
    this._user = null;
    sessionStorage.removeItem(sessionKey);
    this.router.navigate(['/auth/sign-in']);
  }
}

@Injectable()
export class AuthGuardService implements CanActivate {
  private router = inject(Router);
  private authService = inject(AuthService);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isLoggedIn = this.authService.loggedIn;
    const isAuthForm = [
      'sign-in',
      'reset-password',
      'register',
      'change-password/:recoveryCode',
    ].includes(route.routeConfig?.path || defaultPath);

    // Logged-in users have no business on the auth forms, and everyone else
    // is sent to the sign-in page instead of getting a blank screen.
    if (isLoggedIn && isAuthForm) {
      this.router.navigate([defaultPath]);
      return false;
    }

    if (!isLoggedIn && !isAuthForm) {
      this.router.navigate(['/auth/sign-in']);
      return false;
    }

    if (isLoggedIn) {
      this.authService.lastAuthenticatedPath = route.routeConfig?.path || defaultPath;
    }

    return true;
  }
}
