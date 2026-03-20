import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 👈 ESTO QUITA EL ERROR NG8002
import { PedidosService } from '../../services/pedidos';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule], // 👈 IMPORTANTE TENER AMBOS AQUÍ
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent implements OnInit {
  // 1. Declaramos las variables que el HTML está buscando
  pedidos: any[] = [];
  newsletter: any[] = [];
  seccion: string = 'pedidos'; 

  nuevoProd = {
    nombre: '',
    precio: 0,
    categoria: 'nuevos',
    img: '',
    descripcion: ''
  };

  constructor(private pedidosService: PedidosService) { }

  ngOnInit() {
    this.cargarPedidos();
  }

  // 2. Declaramos las funciones que el HTML llama en los (click)
  cargarPedidos() {
    this.pedidosService.obtenerPedidos().subscribe({
      next: (datos) => this.pedidos = datos,
      error: (e) => console.error("Error al cargar pedidos:", e)
    });
  }

  cargarNewsletter() {
    this.pedidosService.obtenerNewsletter().subscribe({
      next: (datos) => this.newsletter = datos,
      error: (e) => console.error("Error al cargar newsletter:", e)
    });
  }

  cambiarSeccion(nombre: string) {
    this.seccion = nombre;
    if (nombre === 'pedidos') this.cargarPedidos();
    if (nombre === 'newsletter') this.cargarNewsletter();
  }

  guardarProducto() {
    if (!this.nuevoProd.nombre || this.nuevoProd.precio <= 0) {
      alert("Por favor, llena los campos del producto.");
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

  eliminarPedido(id: string) {
    if (confirm('¿Deseas eliminar este registro?')) {
      this.pedidosService.eliminarPedido(id).subscribe(() => this.cargarPedidos());
    }
  }
}