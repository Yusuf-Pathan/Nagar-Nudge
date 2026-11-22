import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { TOKEN_KEY } from '../constants/app.constants';
import { ApiEndpoint } from '../enums/api-endpoint.enum';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest } from '../models';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpService) {}

  login(payload: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<AuthResponse, LoginRequest>(ApiEndpoint.LOGIN, payload)
      .pipe(tap(res => this.saveToken(res.data.accessToken)));
  }

  register(payload: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<AuthResponse, RegisterRequest>(ApiEndpoint.REGISTER, payload);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  private saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }
}
