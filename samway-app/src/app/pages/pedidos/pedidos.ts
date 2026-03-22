import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PedidosService } from '../../services/pedidos';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos.html',
  styleUrls: ['./pedidos.css']
})
export class PedidosComponent implements OnInit {
  pedidos: any[] = [];
  newsletter: any[] = [];
  productos: any[] = [];
  seccion: string = 'pedidos'; 
  subSeccion: string = 'lista';
  tabActiva: string = 'info'; 
  mostrarConfirmacion: boolean = false;
  idEliminar: string = '';
  editando: boolean = false;
  idProductoEditando: string = '';

  // Se actualizó la categoría inicial para que coincida con el menú
  nuevoProd = {
    nombre: '',
    precio: 0,
    categoria: 'Sandwich',
    img: '',
    descripcion: ''
  };

  constructor(private pedidosService: PedidosService, private router: Router) {}

  ngOnInit(): void {
    this.cargarPedidos();
    this.cargarProductos();
  }

  cambiarSeccion(nombre: string) {
    this.seccion = nombre;
    this.subSeccion = 'lista';
    if (nombre === 'newsletter') this.cargarNewsletter();
    if (nombre === 'pedidos') this.cargarPedidos();
    if (nombre === 'nuevo') this.cargarProductos();
  }

  salir() {
    this.router.navigate(['/login']);
  }

  cargarProductos() {
    this.pedidosService.obtenerProductos().subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error("Error al obtener productos:", err)
    });
  }

  abrirFormulario(producto?: any) {
    if (producto) {
      this.editando = true;
      this.idProductoEditando = producto._id;
      this.nuevoProd = { ...producto };
    } else {
      this.editando = false;
      // Se asegura que al resetear el formulario use una categoría válida
      this.nuevoProd = { 
        nombre: '', 
        precio: 0, 
        categoria: 'Sandwich', 
        img: '', 
        descripcion: '' 
      };
    }
    this.subSeccion = 'formulario';
  }

  guardarProducto() {
    if (!this.nuevoProd.nombre || this.nuevoProd.precio <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Por favor, ingresa el nombre y un precio válido.',
        confirmButtonColor: '#d4a373'
      });
      return;
    }

    if (this.editando) {
      this.pedidosService.actualizarProducto(this.idProductoEditando, this.nuevoProd).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: 'El producto se modificó correctamente.',
            timer: 2000,
            showConfirmButton: false
          });
          this.cancelarAccion();
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar', 'error')
      });
    } else {
      this.pedidosService.crearProducto(this.nuevoProd).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: '¡Guardado!',
            text: 'Producto añadido al inventario.',
            timer: 2000,
            showConfirmButton: false
          });
          this.cancelarAccion();
        },
        error: () => Swal.fire('Error', 'Hubo un error al guardar.', 'error')
      });
    }
  }

  eliminarProducto(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Eliminarás este producto del inventario.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d4a373',
      cancelButtonColor: '#ff4d4d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pedidosService.eliminarProducto(id).subscribe({
          next: () => {
            this.cargarProductos();
            Swal.fire('¡Eliminado!', 'El producto ha sido quitado.', 'success');
          },
          error: (err) => console.error("Error al eliminar", err)
        });
      }
    });
  }

  cancelarAccion() {
    this.subSeccion = 'lista';
    this.editando = false;
    this.cargarProductos();
  }

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