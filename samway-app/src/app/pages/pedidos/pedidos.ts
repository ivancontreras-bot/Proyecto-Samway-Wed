import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidosService } from '../../services/pedidos';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos.html',
  styleUrls: ['./pedidos.css']
})
export class PedidosComponent implements OnInit {
  // --- VARIABLES DE DATOS ---
  pedidos: any[] = [];
  newsletter: any[] = [];
  seccion: string = 'pedidos'; 
  
  // --- VARIABLES DE CONTROL (MODAL) ---
  mostrarConfirmacion = false;
  idEliminar: string = '';

  // --- MODELO PARA NUEVO PRODUCTO ---
  nuevoProd = {
    nombre: '',
    precio: 0,
    categoria: 'nuevos',
    img: '',
    descripcion: ''
  };

  constructor(private pedidosService: PedidosService) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  // --- NAVEGACIÓN ---
  cambiarSeccion(nombre: string) {
    this.seccion = nombre;
    if (nombre === 'newsletter') {
      this.cargarNewsletter();
    } else if (nombre === 'pedidos') {
      this.cargarPedidos();
    }
  }

  // --- MÉTODOS DE CARGA ---
  cargarPedidos() {
    this.pedidosService.obtenerPedidos().subscribe({
      next: (data) => this.pedidos = data,
      error: (err) => console.error("Error pedidos:", err)
    });
  }

  cargarNewsletter() {
    this.pedidosService.obtenerNewsletter().subscribe({
      next: (data) => {
        console.log("Newsletter recibido:", data);
        this.newsletter = data;
      },
      error: (err) => console.error("Error newsletter:", err)
    });
  }

  // --- GESTIÓN DE PRODUCTOS ---
  guardarProducto() {
    if (!this.nuevoProd.nombre || this.nuevoProd.precio <= 0) {
      alert("Completa los datos del producto.");
      return;
    }
    this.pedidosService.crearProducto(this.nuevoProd).subscribe({
      next: () => {
        alert("¡Producto guardado!");
        this.nuevoProd = { nombre: '', precio: 0, categoria: 'nuevos', img: '', descripcion: '' };
      },
      error: () => alert("Error al guardar")
    });
  }

  // --- GESTIÓN DE PEDIDOS (CAMBIO DE ESTADO) ---
  cambiarEstado(id: string, nuevoEstado: string) {
    this.pedidosService.actualizarEstado(id, nuevoEstado).subscribe(() => this.cargarPedidos());
  }

  // --- ELIMINACIÓN (CON MODAL) ---
  abrirModalBorrar(id: string) {
    this.idEliminar = id;
    this.mostrarConfirmacion = true;
  }

  // 👈 AQUÍ ESTABA EL ERROR: Reincorporamos la función que pedía el HTML
  confirmarEliminar() {
    if (this.idEliminar) {
      this.pedidosService.eliminarPedido(this.idEliminar).subscribe({
        next: () => {
          this.mostrarConfirmacion = false; // Cerramos el modal
          this.idEliminar = ''; 
          this.cargarPedidos(); // Refrescamos la lista
        },
        error: (err) => console.error("Error al eliminar:", err)
      });
    }
  }

  // Por si tienes un botón de cancelar en el modal
  cancelarEliminar() {
    this.mostrarConfirmacion = false;
    this.idEliminar = '';
  }
}