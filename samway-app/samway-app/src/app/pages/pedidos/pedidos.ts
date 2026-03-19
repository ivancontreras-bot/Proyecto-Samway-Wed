import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidosService } from '../../services/pedidos';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos.html',
  styleUrls: ['./pedidos.css']
})
export class PedidosComponent implements OnInit {
  pedidos: any[] = [];
  mostrarConfirmacion = false;
  idEliminar: string = ''; // 🚩 Asegúrate de que sea string

  constructor(private pedidosService: PedidosService) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.pedidosService.obtenerPedidos().subscribe({
      next: (data: any) => {
        // Limpiamos y asignamos para evitar duplicados visuales
        this.pedidos = [...data];
      },
      error: (err) => console.error("Error al cargar:", err)
    });
  }

  cambiarEstado(id: string, nuevoEstado: string) {
    if (!id) return;
    this.pedidosService.actualizarEstado(id, nuevoEstado).subscribe({
      next: () => this.cargarPedidos(),
      error: (err) => alert("Error al actualizar")
    });
  }

  // 🗑️ ELIMINAR: Función corregida
  abrirModalBorrar(id: string) {
    console.log("ID a eliminar:", id); // Para debug en consola
    this.idEliminar = id;
    this.mostrarConfirmacion = true;
  }

  confirmarEliminar() {
    if (!this.idEliminar) return;
    
    this.pedidosService.eliminarPedido(this.idEliminar).subscribe({
      next: () => {
        this.mostrarConfirmacion = false;
        this.idEliminar = '';
        this.cargarPedidos();
      },
      error: (err) => {
        console.error(err);
        alert("No se pudo eliminar el pedido");
      }
    });
  }
}