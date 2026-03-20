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
  // Variables de control y datos
  pedidos: any[] = [];
  newsletter: any[] = [];
  seccion: string = 'pedidos'; 
  
  mostrarConfirmacion = false;
  idEliminar: string = '';

  // Modelo para nuevo producto
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

  // --- MÉTODOS DE ACCIÓN ---

  cargarPedidos() {
    this.pedidosService.obtenerPedidos().subscribe({
      next: (data) => this.pedidos = data,
      error: (err) => console.error(err)
    });
  }

  cargarNewsletter() {
    this.pedidosService.obtenerNewsletter().subscribe({
      next: (data) => this.newsletter = data,
      error: (err) => console.error(err)
    });
  }

  cambiarEstado(id: string, nuevoEstado: string) {
    this.pedidosService.actualizarEstado(id, nuevoEstado).subscribe(() => this.cargarPedidos());
  }

  guardarProducto() {
    if (!this.nuevoProd.nombre || this.nuevoProd.precio <= 0) {
      alert("Por favor, completa los datos básicos.");
      return;
    }
    this.pedidosService.crearProducto(this.nuevoProd).subscribe({
      next: () => {
        alert("Producto guardado correctamente");
        this.nuevoProd = { nombre: '', precio: 0, categoria: 'nuevos', img: '', descripcion: '' };
      },
      error: () => alert("Error al guardar")
    });
  }

  abrirModalBorrar(id: string) {
    this.idEliminar = id;
    this.mostrarConfirmacion = true;
  }

  confirmarEliminar() {
    this.pedidosService.eliminarPedido(this.idEliminar).subscribe(() => {
      this.mostrarConfirmacion = false;
      this.cargarPedidos();
    });
  }
}