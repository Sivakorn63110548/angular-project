import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FormsModule,
    RouterModule,
    ProgressSpinnerModule,
    StepsModule,
    ReactiveFormsModule,
    ToastModule
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FormsModule,
    RouterModule,
    ProgressSpinnerModule,
    StepsModule,
    ReactiveFormsModule,
    ToastModule
  ],
  providers: [MessageService]
})
export class FunctionModule {
}