import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { TokenService } from '../../../service/auth/TokenService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  constructor(private tokenService: TokenService, private router: Router){

  }


  onLogout(){
    this.tokenService.token = '';
    console.log("logged off!")
    this.router.navigate(['']);
  }

}
