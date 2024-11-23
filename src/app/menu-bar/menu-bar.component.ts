import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { HttpClientModule, HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-bar',
  standalone: true,
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css'],
  imports: [
    MenubarModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    RippleModule,
    CommonModule,
    HttpClientModule
  ]
})
export class MenuBarComponent implements OnInit {
  panelVisible = false;
  isOpen: boolean | undefined;
  userInfo: any;
  errorMessage: string | undefined;
  user: void | undefined;

  constructor(private http: HttpClient, private router:Router) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.loadProfile();
    }
  }
  profile() {
    throw new Error('Method not implemented.');
  }

  private loadProfile() {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      // this.router.navigate(['/']);
      return;
    }

    let decodedToken: any;
    try {
      decodedToken = jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      this.errorMessage = 'Invalid token';
      return;
    }

    if (decodedToken && decodedToken.userId) {
      const userId: string = decodedToken.userId;
      const params = new HttpParams().set('userId', userId);

      this.http.get(`${environment.apiUrl}/auth/profile`, { params })
        .pipe(
          catchError((error) => {
            this.errorMessage = 'Login failed. Please try again.';
            return throwError(() => new Error(error.message || 'Unknown error'));
          })
        )
        .subscribe({
          next: (response: any) => {
            this.userInfo = response;
          },
          error: (err: any) => {
            console.error('Error:', err);
            this.errorMessage = 'Failed to load profile';
          }
        });
    } else {
      this.errorMessage = 'User ID is missing in token';
      this.router.navigate(['/']);
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  log_out() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/']);
  }

  user_detail() {

  }
}

