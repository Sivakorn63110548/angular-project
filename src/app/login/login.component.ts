import { Component, Inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FunctionModule } from '../../function/function.module';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, throwError } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare var FB: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FunctionModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading = false;

  showPassword: boolean = false;

  constructor(private http: HttpClient, private router: Router,  private messageService: MessageService,  @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFacebookSDK();
    }
  }

  loadFacebookSDK() {
    (window as any).fbAsyncInit = function () {
      FB.init({
        appId: 'YOUR_APP_ID',
        cookie: true,
        xfbml: true,
        version: 'v17.0'
      });
    };
  
    ((d, s, id) => {
      let js = d.createElement(s) as HTMLScriptElement;
      let fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
  
      if (fjs && fjs.parentNode) {
        fjs.parentNode.insertBefore(js, fjs);
      }
    })(document, 'script', 'facebook-jssdk');
  }

  async login() {
    this.isLoading = true;
    const loginData = {
      username: this.username,
      password: this.password,
    };

    this.http.post(`${environment.apiUrl}/auth/login`, loginData)
      .pipe(
        catchError((error) => {
          this.errorMessage = 'Login failed. Please try again.';
          return throwError(() => new Error(error.message || 'Unknown error'));
        })
      )
      .subscribe({
        next: (response: any) => {
          const { message, token } = response;
          this.messageService.add({
            severity: 'success',
            summary: 'Login Successful',
            detail: message
          });
          
          localStorage.setItem('authToken', token);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Error:', err);
        }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    
    if (this.showPassword) {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }

  facebook_login(){
    if (typeof FB !== 'undefined' && FB) {
      FB.login((response: any) => {
        if (response.authResponse) {
          const { accessToken } = response.authResponse;

          localStorage.setItem('facebookToken', accessToken);

          FB.api('/me', { fields: 'id,name,email' }, (userInfo: any) => {
            console.log('Facebook user info: ', userInfo);
            this.messageService.add({
              severity: 'success',
              summary: 'Facebook Login Successful',
              detail: `Welcome, ${userInfo.name}`
            });
            this.router.navigate(['/dashboard']);
          });
        } else {
          console.error('User cancelled login or did not fully authorize.');
          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: 'Facebook login failed. Please try again.'
          });
        }
      }, { scope: 'public_profile,email' });
    }
  }
  
}
