import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth/AuthService';
import { ToastrService } from '../../../toastr.service';
import { RegistrationRequest } from '../../../models/requests/RegistrationRequest';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      var auth = new RegistrationRequest();
      auth.firstName = this.registerForm.value.firstName;
      auth.lastName = this.registerForm.value.lastName;
      auth.email = this.registerForm.value.email;
      auth.password = this.registerForm.value.password;

      this.authService
        .register(auth)
        .pipe(
          catchError((error) => {
            if (error.status === 400) {
              this.showToast('error', 'Please check your inputs');
            }
            console.error('Register error:');
            return throwError(() => new Error('Register error ' + error));
          })
        )
        .subscribe((data) => {
          this.showToast('success', 'Activation code is being sent to your email');
          //TODO route to verification
            this.router.navigate(['/activate',  { 'data': auth.email  }]);
        });
    }
  }

  onLoginLink(){
    this.router.navigate(['']);
  }

  showToast(type: string, error: string) {
    this.toastr.showToast(type, 'Login failed! ' + error, 'top-right', true);
  }
}
