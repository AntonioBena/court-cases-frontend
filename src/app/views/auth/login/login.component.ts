import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../service/auth/AuthService';
import { AuthenticationRequest } from '../../../models/requests/AuthenticationRequest';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      var auth = new AuthenticationRequest();
      auth.email = this.loginForm.value.email;
      auth.password = this.loginForm.value.password;

      console.log("loginReq: " + JSON.stringify(auth))
      this.authService.login(auth).subscribe({
        next: (response) => {
          console.log('Login Successful:', response);
          localStorage.setItem('token', response.token); // Store token
          //this.router.navigate(['/dashboard']); // Redirect to dashboard
        },
        error: (err) => {
          console.error('Login Failed:', err);
          alert('Invalid credentials'); // Show alert on error //TODO rijesi ovo
        }
      });
    }
  }

}
