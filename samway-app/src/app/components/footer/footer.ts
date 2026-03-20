import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidosService } from '../../services/pedidos'; // 👈 Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class FooterComponent {
  email: string = "";

  constructor(private pedidosService: PedidosService) {}

  suscribir() {
    // Expresión regular para validar formato de correo
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

    if (!this.email) {
      alert('Por favor, ingresa un correo electrónico.');
      return;
    }

    if (emailPattern.test(this.email.toLowerCase())) {
      
      // 🚀 CAMBIO CLAVE: Enviamos el correo a la base de datos
      this.pedidosService.registrarNewsletter(this.email).subscribe({
        next: (res: any) => {
          console.log("Suscripción guardada en Mongo:", res);
          alert(`¡Gracias por suscribirte con el correo: ${this.email}!`);
          this.email = ""; // Limpiamos el campo después del éxito
        },
        error: (err: any) => {
          console.error("Error al suscribir:", err);
          // Si el correo ya existe (índice único en Mongo), mostramos aviso
          if (err.status === 400) {
            alert("Este correo ya está registrado en nuestro newsletter.");
          } else {
            alert("Error de conexión con el servidor.");
          }
        }
      });

    } else {
      alert('Por favor, ingresa un formato de correo válido (ejemplo@correo.com).');
    }
  }
}