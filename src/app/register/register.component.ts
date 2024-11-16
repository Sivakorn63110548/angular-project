import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { FunctionModule } from '../../function/function.module';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FunctionModule,
    HttpClientModule
  ],
  providers: [MessageService],
  animations: [
    trigger('slide', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)' }),
        animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  [x: string]: any;
  activeIndex: number = 0;
  steps: any[];
  personalInfoForm: FormGroup;
  accountForm: FormGroup;
  contactForm: FormGroup;
  reviewForm: FormGroup;
  errorMessage: string | undefined;
  isLoading = false;
  selectedImage: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient, 
    private messageService: MessageService, 
    private router: Router
  ) {
    this.steps = [
      { label: 'Personal Info' },
      { label: 'Account Details' },
      { label: 'Contact Info' },
      { label: 'Review' },
    ];
    this.personalInfoForm = this.fb.group({
      name: [''],
      email: [''],
    });
    this.accountForm = this.fb.group({
      username: [''],
      password: [''],
    });
    this.contactForm = this.fb.group({
      phone: [''],
      address: [''],
    });
    this.reviewForm = this.fb.group({});
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.selectedImage = reader.result;
      };
      
      reader.readAsDataURL(file);
    }
  }

  nextStep() {
    if (this.activeIndex < this.steps.length - 1) {
      this.activeIndex++;
    }
  }

  previousStep() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    }
  }

  submitForm() {
    const user_detail = {
      img: this.selectedImage,
      name: this.personalInfoForm.value.name,
      email: this.personalInfoForm.value.email,
      username: this.accountForm.value.username,
      password: this.accountForm.value.password,
      phone: this.contactForm.value.phone,
      address: this.contactForm.value.address
    };

    if (!user_detail.img || !user_detail.name || !user_detail.email || !user_detail.username || !user_detail.password || !user_detail.phone || !user_detail.address) {
      this.messageService.add({
        severity: 'error',
        summary: 'Missing Information',
        detail: 'Please fill in all required fields.'
      });
      return;
    }
    
    this.isLoading = true;

    this.http.post(`${environment.apiUrl}/auth/register`, user_detail)
    .pipe(
      catchError((error) => {
        this.errorMessage = 'Login failed. Please try again.';
        return throwError(() => new Error(error.message || 'Unknown error'));
      })
    )
    .subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registration successful!' });
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }
}
