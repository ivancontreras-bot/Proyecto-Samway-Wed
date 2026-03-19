import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importante para ngModel

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule], // Añadimos FormsModule
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class FooterComponent {
  email: string = "";

  suscribir() {
    // Expresión regular para validar formato de correo
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

    if (!this.email) {
      alert('Por favor, ingresa un correo electrónico.');
      return;
    }

    if (emailPattern.test(this.email.toLowerCase())) {
      alert(`¡Gracias por suscribirte con el correo: ${this.email}!`);
      this.email = ""; // Limpiamos el campo después del éxito
    } else {
      alert('Por favor, ingresa un formato de correo válido (ejemplo@correo.com).');
    }
  }
}