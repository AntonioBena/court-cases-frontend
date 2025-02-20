import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../service/auth/AuthService';
import { ToastrService } from '../../../toastr.service';
import { catchError, throwError } from 'rxjs';
@Component({
  selector: 'app-acivate',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './acivate.component.html',
  styleUrl: './acivate.component.css',
})
export class AcivateComponent {
  email: string = '';
  otpForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    public route: ActivatedRoute
  ) {
    route.params.subscribe(params => {
      this.email = params['data']
    });
    this.otpForm = this.fb.group({
      zero: new FormControl('', [ // Ensure second argument is an array of synchronous validators
        Validators.required,
        Validators.maxLength(1),
        Validators.pattern(/^.{1}$/) // Ensures exactly one character
      ]),
      first: ['', [Validators.required]],
      second: ['', [Validators.required]],
      third: ['', [Validators.required]],
      fourth: ['', [Validators.required]],
      fifth: ['', [Validators.required]],
    });
  }

  limitToOneChar(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 1) {
      input.value = input.value.charAt(0); // Keep only the first character
    }
  }
  moveFocus(event: Event, nextInput: HTMLInputElement | null) {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1 && nextInput) {
      nextInput.focus();
    }
  }
  handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text') || '';
    const chars = pasteData.split('').slice(0, 6);

    if (chars.length === 6) {
      this.otpForm.patchValue({
        zero: chars[0],
        first: chars[1],
        second: chars[2],
        third: chars[3],
        fourth: chars[4],
        fifth: chars[5]
      });
    }
  }

  onActivateAccount() {
    if (this.otpForm.valid) {
      var otpCode =
        this.otpForm.value.zero +
        this.otpForm.value.first +
        this.otpForm.value.second +
        this.otpForm.value.third +
        this.otpForm.value.fourth +
        this.otpForm.value.fifth;
      console.log('otp: ' + otpCode);

      this.authService
        .activateAccount(otpCode)
        .pipe(
          catchError((error) => {
            if (error.status === 400) {
              this.showToast('error', 'Please check your inputs');
            }
            console.error('Register error:');
            return throwError(() => new Error('Activation error ' + error));
          })
        )
        .subscribe((data) => {
          this.showToast('success', 'Acaunt is successfuly activated!');
            this.router.navigate(['']);
        });
    }
    //this.router.navigate(['']);
  }

  showToast(type: string, error: string) {
    this.toastr.showToast(type, 'Login failed! ' + error, 'top-right', true);
  }
}
