import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidosService } from '../../services/pedidos';
import Swal from 'sweetalert2'; // <--- Importación de la librería

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
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

    // 1. Validación de campo vacío
    if (!this.email) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Por favor, ingresa un correo electrónico.',
        confirmButtonColor: '#5d4037' // Color café Samway
      });
      return;
    }

    // 2. Validación de formato
    if (emailPattern.test(this.email.toLowerCase())) {
      
      this.pedidosService.registrarNewsletter(this.email).subscribe({
        next: (res: any) => {
          // VENTANA DE ÉXITO MODERNA
          Swal.fire({
            icon: 'success',
            title: '¡Suscripción Exitosa!',
            text: `Gracias por suscribirte con: ${this.email}`,
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
            iconColor: '#5d4037'
          });
          this.email = ""; 
        },
        error: (err: any) => {
          // VENTANA DE ERROR (Correo duplicado o Servidor caído)
          const mensajeError = err.status === 400 
            ? "Este correo ya está registrado en nuestro newsletter." 
            : "Hubo un problema con el servidor. Intenta más tarde.";

          Swal.fire({
            icon: 'error',
            title: 'No se pudo registrar',
            text: mensajeError,
            confirmButtonColor: '#5d4037'
          });
        }
      });

    } else {
      // VENTANA DE FORMATO INVÁLIDO
      Swal.fire({
        icon: 'error',
        title: 'Formato incorrecto',
        text: 'Por favor, ingresa un correo válido (ejemplo@correo.com).',
        confirmButtonColor: '#5d4037'
      });
    }
  }
}