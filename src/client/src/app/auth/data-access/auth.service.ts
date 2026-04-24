import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../../core/models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  getMe() {
    return this.http.get<User>(`${this.base}/api/auth/me`);
  }

  initiateGoogleLogin(): void {
    window.location.href = `${this.base}/api/auth/google`;
  }
}
