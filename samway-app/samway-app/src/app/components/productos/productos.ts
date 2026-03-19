import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ModalComponent } from '../modal/modal';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css']
})
export class ProductosComponent {
  total = 0;
  modal = false; 
  mostrarDetalle = false; 
  carritoAbierto = false; // Controla el despliegue del carrito
  carrito: any[] = [];
  
  productoSeleccionado: any = { nombre: '', precio: 0, descripcion: '', notas: '' };

  productos = [
    { nombre: "Croissant", precio: 42, categoria: "pan", img: "/croissant.jpg", descripcion: "Pan de hojaldre francés, crujiente por fuera y tierno por dentro." },
    { nombre: "Garibaldi", precio: 43, categoria: "pan", img: "/garibaldi.jpg", descripcion: "Pan dulce tradicional cubierto de mermelada y chochitos blancos." },
    { nombre: "Chocolatin", precio: 75, categoria: "pan", img: "/chocolatin.jpg", descripcion: "Hojaldre relleno de chocolate semi-amargo de alta calidad." },
    { nombre: "Club Sandwich", precio: 95, categoria: "sandwich", img: "/club.jpg", descripcion: "Tres pisos con pollo, jamón, tocino, queso, lechuga y jitomate." },
    { nombre: "Panini", precio: 110, categoria: "sandwich", img: "/panini.jpg", descripcion: "Pan artesanal a la plancha con ingredientes gourmet y queso fundido." },
    { nombre: "Sandwich Jamon", precio: 80, categoria: "sandwich", img: "/jamon.jpg", descripcion: "Clásico sándwich de jamón de pavo con aderezo de la casa." },
    { nombre: "Ensalada Cesar", precio: 120, categoria: "ensalada", img: "/cesar.jpg", descripcion: "Lechuga orejona, crotones, parmesano y aderezo César." },
    { nombre: "Ensalada Verde", precio: 95, categoria: "ensalada", img: "/verde.jpg", descripcion: "Mezcla de lechugas frescas, pepino, manzana y vinagreta de cítricos." },
    { nombre: "Cafe", precio: 35, categoria: "bebida", img: "/cafe.jpg", descripcion: "Café de grano recién molido, tueste medio." },
    { nombre: "Capuccino", precio: 48, categoria: "bebida", img: "/capuccino.jpg", descripcion: "Equilibrio perfecto entre espresso, leche vaporizada y espuma." },
    { nombre: "Jugo Natural", precio: 40, categoria: "bebida", img: "/jugo.jpg", descripcion: "Jugo de naranja 100% natural, exprimido al momento." },
    { nombre: "Paquete Desayuno", precio: 150, categoria: "paquete", img: "/desayuno.jpg", descripcion: "Incluye café, jugo pequeño y un sándwich de jamón." },
    { nombre: "Paquete Pareja", precio: 250, categoria: "paquete", img: "/pareja.jpg", descripcion: "2 bebidas, 2 piezas de pan y 1 ensalada grande." }
  ];

  toggleCarrito() {
    this.carritoAbierto = !this.carritoAbierto;
  }

  agregar(producto: any) {
    this.total += producto.precio;
    this.carrito.push({ ...producto, notas: '' });
    this.carritoAbierto = true; // Abre el carrito automáticamente al agregar
  }

  verDetalle(producto: any) {
    this.productoSeleccionado = { ...producto, notas: '' }; 
    this.mostrarDetalle = true;
  }

  confirmarAgregar() {
    this.total += this.productoSeleccionado.precio;
    this.carrito.push({ ...this.productoSeleccionado }); 
    this.mostrarDetalle = false;
    this.carritoAbierto = true; // Abre el carrito tras confirmar notas
  }

  abrir() { this.modal = true; }
  cerrar() { this.modal = false; }
  cerrarDetalle() { this.mostrarDetalle = false; }
}