import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PedidosService } from '../../services/pedidos';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos.html',
  styleUrls: ['./pedidos.css']
})
export class PedidosComponent implements OnInit {
  // --- LISTAS DE DATOS ---
  pedidos: any[] = [];
  newsletter: any[] = [];
  productos: any[] = []; // Nueva lista para el inventario

  // --- CONTROL DE VISTA ---
  seccion: string = 'pedidos'; 
  subSeccion: string = 'lista'; // Controla si vemos la tabla o el formulario de productos
  tabActiva: string = 'info'; 

  // --- ESTADOS DE EDICIÓN Y MODALES ---
  mostrarConfirmacion: boolean = false;
  idEliminar: string = '';
  editando: boolean = false;
  idProductoEditando: string = '';

  // --- MODELO ---
  nuevoProd = {
    nombre: '',
    precio: 0,
    categoria: 'Pan Dulce',
    img: '',
    descripcion: ''
  };

  constructor(private pedidosService: PedidosService, private router: Router) {}

  ngOnInit(): void {
    this.cargarPedidos();
    this.cargarProductos();
  }

  // --- NAVEGACIÓN ---
  cambiarSeccion(nombre: string) {
    this.seccion = nombre;
    this.subSeccion = 'lista'; // Resetear a lista al cambiar de menú
    this.tabActiva = 'info';
    
    if (nombre === 'newsletter') this.cargarNewsletter();
    if (nombre === 'pedidos') this.cargarPedidos();
    if (nombre === 'nuevo') this.cargarProductos();
  }

  salir() {
    this.router.navigate(['/login']);
  }

  // --- GESTIÓN DE PRODUCTOS (CRUD) ---
  cargarProductos() {
    this.pedidosService.obtenerProductos().subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error("Error al obtener productos:", err)
    });
  }

  abrirFormulario(producto?: any) {
    if (producto) {
      // MODO EDICIÓN
      this.editando = true;
      this.idProductoEditando = producto._id;
      this.nuevoProd = { ...producto }; // Clonamos los datos para no afectar la tabla original
    } else {
      // MODO CREACIÓN
      this.editando = false;
      this.nuevoProd = { nombre: '', precio: 0, categoria: 'Pan Dulce', img: '', descripcion: '' };
    }
    this.subSeccion = 'formulario';
  }

  guardarProducto() {
    if (!this.nuevoProd.nombre || this.nuevoProd.precio <= 0) {
      alert("Por favor, ingresa el nombre y un precio válido.");
      return;
    }

    if (this.editando) {
      // ACTUALIZAR EXISTENTE
      this.pedidosService.actualizarProducto(this.idProductoEditando, this.nuevoProd).subscribe({
        next: () => {
          alert("¡Producto actualizado!");
          this.cancelarAccion();
        },
        error: () => alert("Error al actualizar")
      });
    } else {
      // CREAR NUEVO
      this.pedidosService.crearProducto(this.nuevoProd).subscribe({
        next: () => {
          alert("¡Producto guardado exitosamente!");
          this.cancelarAccion();
        },
        error: () => alert("Hubo un error al guardar el producto.")
      });
    }
  }

  eliminarProducto(id: string) {
    if (confirm('¿Estás seguro de eliminar este producto del inventario?')) {
      this.pedidosService.eliminarProducto(id).subscribe({
        next: () => this.cargarProductos(),
        error: (err) => console.error("Error al eliminar producto", err)
      });
    }
  }

  cancelarAccion() {
    this.subSeccion = 'lista';
    this.editando = false;
    this.cargarProductos();
  }

  // --- GESTIÓN DE PEDIDOS Y NEWSLETTER ---
  cargarPedidos() {
    this.pedidosService.obtenerPedidos().subscribe({
      next: (data) => this.pedidos = data,
      error: (err) => console.error("Error pedidos:", err)
    });
  }

  cargarNewsletter() {
    this.pedidosService.obtenerNewsletter().subscribe({
      next: (data) => this.newsletter = data,
      error: (err) => console.error("Error newsletter:", err)
    });
  }

  cambiarEstado(id: string, nuevoEstado: string) {
    this.pedidosService.actualizarEstado(id, nuevoEstado).subscribe(() => this.cargarPedidos());
  }

  abrirModalBorrar(id: string) {
    this.idEliminar = id;
    this.mostrarConfirmacion = true;
  }

  confirmarEliminar() {
    if (this.idEliminar) {
      this.pedidosService.eliminarPedido(this.idEliminar).subscribe(() => {
        this.mostrarConfirmacion = false;
        this.cargarPedidos();
      });
    }
  }
}