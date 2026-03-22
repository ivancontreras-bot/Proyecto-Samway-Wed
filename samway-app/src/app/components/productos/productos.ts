import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ModalComponent } from '../modal/modal';
import { PedidosService } from '../../services/pedidos';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css']
})
export class ProductosComponent implements OnInit {
  total = 0;
  modal = false; 
  mostrarDetalle = false; 
  carritoAbierto = false; 
  carrito: any[] = [];
  
  productoSeleccionado: any = { nombre: '', precio: 0, descripcion: '', notas: '' };

  // Arreglo dinámico que se llena desde MongoDB
  productos: any[] = [];

  constructor(private pedidosService: PedidosService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.pedidosService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (err) => console.error("Error al cargar productos dinámicos:", err)
    });
  }

  toggleCarrito() {
    this.carritoAbierto = !this.carritoAbierto;
  }

  agregar(producto: any) {
    this.total += producto.precio;
    this.carrito.push({ ...producto, notas: '' });
    this.carritoAbierto = true;
  }

  verDetalle(producto: any) {
    this.productoSeleccionado = { ...producto, notas: '' }; 
    this.mostrarDetalle = true;
  }

  confirmarAgregar() {
    this.total += this.productoSeleccionado.precio;
    this.carrito.push({ ...this.productoSeleccionado }); 
    this.mostrarDetalle = false;
    this.carritoAbierto = true;
  }

  vaciarCarrito() {
    this.carrito = [];
    this.total = 0;
  }

  abrir() { this.modal = true; }
  cerrar() { this.modal = false; }
  cerrarDetalle() { this.mostrarDetalle = false; }
}