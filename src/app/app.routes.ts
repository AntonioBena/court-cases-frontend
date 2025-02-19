import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './service/auth/auth.guard';
import { LoginComponent } from './views/auth/login/login.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // Login page is the default
  //{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' } // Redirect unknown routes to login
];
