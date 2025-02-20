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
import { ToastrService } from '../../../toastr.service';
import { catchError, throwError } from 'rxjs';
import { TokenService } from '../../../service/auth/TokenService';

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

  constructor(private fb: FormBuilder, private router: Router,
    private authService: AuthService, private toastr: ToastrService,
    private tokenService: TokenService  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onRegisterLink(){
    this.router.navigate(['/register']);
  }

  onLogin() {
    if (this.loginForm.valid) {
      var auth = new AuthenticationRequest();
      auth.email = this.loginForm.value.email;
      auth.password = this.loginForm.value.password;

      this.authService.login(auth)
        .pipe(
          catchError(error => {
            if(error.status === 400){
            this.showToast('error', 'Please check email and password');
            }
            console.error('Login error:');
            return throwError(
              () => new Error('Login error '+JSON.stringify(error)));
          })
        ).subscribe(data => {
          console.log('Login Successful:', data);
          this.tokenService.token = data.token as string;
          this.router.navigate(['/main']);
        })
    }
  }

  showToast(type: string, error:string) {
    this.toastr.showToast(type, "Login failed! " + error, "top-right", true);
  }
}
