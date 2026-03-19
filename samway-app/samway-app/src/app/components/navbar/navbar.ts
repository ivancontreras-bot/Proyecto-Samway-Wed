import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {

  oscuroActivo = false;

  oscuro(){

    this.oscuroActivo = !this.oscuroActivo;

    if(this.oscuroActivo){
      document.body.classList.add("dark")
    }else{
      document.body.classList.remove("dark")
    }

  }

}