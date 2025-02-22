import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './service/auth/auth.guard';
import { LoginComponent } from './views/auth/login/login.component';
import { RegisterComponent } from './views/auth/register/register.component';
import { AcivateComponent } from './views/auth/acivate/acivate.component';
import { MainComponent } from './views/main/main.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // Login page is the default
  //{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'activate', component: AcivateComponent },
  { path: 'main', component: MainComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' } // Redirect unknown routes to login
];
