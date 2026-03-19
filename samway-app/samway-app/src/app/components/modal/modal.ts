import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidosService } from '../../services/pedidos';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal.html',
  styleUrls: ['./modal.css']
})
export class ModalComponent {
  @Input() carrito: any[] = [];
  @Input() total: number = 0;
  @Output() cerrar = new EventEmitter<void>();
  @Output() pedidoFinalizado = new EventEmitter<void>();

  nombre: string = "";
  direccion: string = "";
  pedidoConfirmado: boolean = false;
  cargando: boolean = false;

  constructor(
    private pedidosService: PedidosService,
    private cdr: ChangeDetectorRef
  ) {}

  // --- VALIDACIONES (Del código original) ---
  
  // Solo letras, tildes y espacios
  get nombreEsValido(): boolean {
    const pattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return pattern.test(this.nombre) && this.nombre.trim().length >= 3;
  }

  // Dirección con longitud mínima
  get direccionEsValida(): boolean {
    return this.direccion.trim().length >= 5;
  }

  // El botón de enviar usará esto para habilitarse
  get formularioValido(): boolean {
    return this.nombreEsValido && this.direccionEsValida;
  }

  // --- FUNCIONES (Mezcladas) ---

  confirmar() {
    // Si intentan forzar el envío sin cumplir las validaciones
    if (!this.formularioValido) {
      alert("Por favor, verifica los datos. El nombre solo debe llevar letras.");
      return;
    }

    this.cargando = true; 
    console.log("Enviando pedido a Flask...");

    // Mantenemos los nombres de las propiedades para que coincidan con tu tabla de ADMIN
    const pedido = {
      nombre: this.nombre.trim(),    // Coincide con p.nombre en tu tabla
      direccion: this.direccion.trim(), 
      productos: this.carrito,       // Coincide con p.productos en tu tabla
      total: this.total,
      fecha: new Date(),
      estado: 'Pendiente'
    };

    this.pedidosService.agregarPedido(pedido).subscribe({
      next: (res) => {
        console.log("Respuesta recibida del servidor (201):", res);
        this.cargando = false; 
        this.pedidoConfirmado = true; 

        // Forzamos la actualización de la vista para mostrar el check ✅
        this.cdr.detectChanges(); 
        this.pedidoFinalizado.emit(); // Limpia el carrito
      },
      error: (err) => {
        console.error("Error en la suscripción:", err);
        this.cargando = false;
        this.cdr.detectChanges();
        alert("Error al enviar el pedido. Revisa la consola.");
      }
    });
  }

  cerrarModal() {
    // Si ya se confirmó, limpiamos para la próxima vez que se abra
    if (this.pedidoConfirmado) {
      this.pedidoConfirmado = false;
      this.nombre = "";
      this.direccion = "";
    }
    this.cerrar.emit();
  }
}