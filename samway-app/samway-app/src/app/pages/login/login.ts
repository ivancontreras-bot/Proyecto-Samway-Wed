import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
selector: 'app-login',
standalone: true,
imports: [FormsModule],
templateUrl: './login.html',
styleUrls: ['./login.css']
})

export class LoginComponent {

usuario = "";
password = "";

constructor(private router: Router){}

entrar(){

if(this.usuario === "admin" && this.password === "1234"){

localStorage.setItem("admin","true");

this.router.navigate(['/pedidos']);

}else{

alert("Usuario o contraseña incorrectos");

}

}

}