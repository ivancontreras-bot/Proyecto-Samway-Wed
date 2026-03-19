import { Component, OnInit } from '@angular/core'; // Añadimos OnInit para buenas prácticas
import { CommonModule } from '@angular/common';
import { PedidosService } from '../../services/pedidos';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent implements OnInit {

  pedidos: any[] = [];

  constructor(private pedidosService: PedidosService) { }

  // Se ejecuta automáticamente al cargar el componente
  ngOnInit() {
    this.cargarPedidos();
  }

  // Corregimos la asignación directa usando .subscribe()
  cargarPedidos() {
    this.pedidosService.obtenerPedidos().subscribe({
      next: (datos) => {
        this.pedidos = datos;
      },
      error: (e) => {
        console.error("Error al cargar pedidos en el panel de admin:", e);
      }
    });
  }

  // Función para eliminar pedidos si es necesario desde el panel admin
  eliminarPedido(id: string) {
    if (confirm('¿Deseas eliminar este registro de la base de datos?')) {
      this.pedidosService.eliminarPedido(id).subscribe(() => {
        this.cargarPedidos(); // Recarga la lista tras borrar
      });
    }
  }
}