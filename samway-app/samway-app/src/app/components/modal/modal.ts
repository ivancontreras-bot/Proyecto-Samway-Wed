import { Component, Input, Output, EventEmitter } from '@angular/core';
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

  constructor(private pedidosService: PedidosService) {}

  // VALIDACIÓN: Solo letras y espacios
  get nombreEsValido(): boolean {
    const pattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return pattern.test(this.nombre) && this.nombre.trim().length >= 3;
  }

  // VALIDACIÓN: Dirección mínima
  get direccionEsValida(): boolean {
    return this.direccion.trim().length >= 5;
  }

  // VALIDACIÓN: Todo el formulario
  get formularioValido(): boolean {
    return this.nombreEsValido && this.direccionEsValida;
  }

  confirmar() {
    if (!this.formularioValido) return;
    
    this.cargando = true;

    const pedido = {
      cliente: this.nombre,
      direccion: this.direccion,
      items: this.carrito,
      total: this.total,
      fecha: new Date(),
      estado: 'Pendiente'
    };

    this.pedidosService.agregarPedido(pedido).subscribe({
      next: () => {
        this.cargando = false; 
        this.pedidoConfirmado = true;
        this.pedidoFinalizado.emit();
      },
      error: (err) => {
        this.cargando = false;
        alert("Error al enviar el pedido");
      }
    });
  }

  cerrarModal() {
    this.cerrar.emit();
  }
}