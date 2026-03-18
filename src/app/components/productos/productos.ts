import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal';


@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css']
})
export class ProductosComponent {
  // --- Estado de la interfaz ---
  total = 0;
  modal = false;
  carritoVisible = true;
  carrito: any[] = [];
  
  // Para la personalización de ingredientes
  productoSeleccionado: any = null;

  // --- Base de datos de productos con ingredientes ---
  productos = [
    { nombre: "Croissant", precio: 42, categoria: "pan", img: "/croissant.jpg", ingredientes: ["Harina de trigo", "Mantequilla", "Huevo", "Azúcar"] },
    { nombre: "Garibaldi", precio: 43, categoria: "pan", img: "/garibaldi.jpg", ingredientes: ["Pan de vainilla", "Mermelada de albaricoque", "Chochitos blancos"] },
    { nombre: "Chocolatin", precio: 75, categoria: "pan", img: "/chocolatin.jpg", ingredientes: ["Hojaldre", "Chocolate negro", "Mantequilla"] },

    { nombre: "Club Sandwich", precio: 95, categoria: "sandwich", img: "/club.jpg", ingredientes: ["Pan de caja", "Pollo", "Tocino", "Jamón", "Queso", "Lechuga", "Jitomate", "Mayonesa"] },
    { nombre: "Panini", precio: 110, categoria: "sandwich", img: "/panini.jpg", ingredientes: ["Pan ciabatta", "Salami", "Queso Provolone", "Pimientos", "Pesto"] },
    { nombre: "Sandwich Jamon", precio: 80, categoria: "sandwich", img: "/jamon.jpg", ingredientes: ["Pan integral", "Jamón de pavo", "Queso panela", "Lechuga"] },

    { nombre: "Ensalada Cesar", precio: 120, categoria: "ensalada", img: "/cesar.jpg", ingredientes: ["Lechuga orejona", "Pollo a la plancha", "Crutones", "Queso parmesano", "Aderezo Cesar"] },
    { nombre: "Ensalada Verde", precio: 95, categoria: "ensalada", img: "/verde.jpg", ingredientes: ["Mezcla de lechugas", "Espinaca", "Pepino", "Manzana verde", "Nuez"] },

    { nombre: "Cafe", precio: 35, categoria: "bebida", img: "/cafe.jpg", ingredientes: ["Granos de café molido", "Agua caliente"] },
    { nombre: "Capuccino", precio: 48, categoria: "bebida", img: "/capuccino.jpg", ingredientes: ["Café espresso", "Leche vaporizada", "Espuma de leche", "Canela"] },
    { nombre: "Jugo Natural", precio: 40, categoria: "bebida", img: "/jugo.jpg", ingredientes: ["Naranja natural", "Pulpa de fruta"] },

    { nombre: "Paquete Desayuno", precio: 150, categoria: "paquete", img: "/desayuno.jpg", ingredientes: ["Huevo al gusto", "Chilaquiles", "Café", "Jugo pequeño"] },
    { nombre: "Paquete Pareja", precio: 250, categoria: "paquete", img: "/pareja.jpg", ingredientes: ["2 Sandwiches", "2 Bebidas", "1 Pan dulce para compartir"] }
  ];

  // --- Métodos de Acción ---

  // Agregado simple (Sin personalizar)
  agregar(producto: any) {
    this.total += producto.precio;
    this.carrito.push({ ...producto, nota: 'Original' });
  }

  // --- Lógica de Personalización ---

  verInformacion(producto: any) {
    this.productoSeleccionado = {
      ...producto,
      seleccionados: [...producto.ingredientes] // Inicia con todos los ingredientes
    };
  }

  toggleIngrediente(ingrediente: string) {
    const index = this.productoSeleccionado.seleccionados.indexOf(ingrediente);
    if (index > -1) {
      this.productoSeleccionado.seleccionados.splice(index, 1);
    } else {
      this.productoSeleccionado.seleccionados.push(ingrediente);
    }
  }

  agregarPersonalizado() {
    this.total += this.productoSeleccionado.precio;
    this.carrito.push({
      nombre: this.productoSeleccionado.nombre,
      precio: this.productoSeleccionado.precio,
      img: this.productoSeleccionado.img,
      nota: "Sin: " + this.obtenerFaltantes()
    });
    this.productoSeleccionado = null; // Cierra el panel de info
  }

  obtenerFaltantes() {
    const faltantes = this.productoSeleccionado.ingredientes.filter(
      (i: string) => !this.productoSeleccionado.seleccionados.includes(i)
    );
    return faltantes.length > 0 ? faltantes.join(', ') : 'Ninguno';
  }

  // --- Controles de Interfaz ---

  abrir() { this.modal = true; }
  
  cerrar() { this.modal = false; }

  toggleCarrito() {
    this.carritoVisible = !this.carritoVisible;
  }
}