import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosComponent } from '../productos/productos';
import { ModalComponent } from '../modal/modal';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, ProductosComponent, ModalComponent],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class MenuComponent {
  carrito: any[] = [];
  total: number = 0;
  mostrarModal: boolean = false;

  agregarAlCarrito(producto: any) {
    this.carrito.push({ ...producto });
    this.total = this.carrito.reduce((acc, p) => acc + p.precio, 0);
  }

  abrirConfirmacion() {
    if (this.carrito.length > 0) {
      this.mostrarModal = true;
    }
  }

  finalizarProcesoPedido() {
    this.carrito = [];
    this.total = 0;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
}