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

  total = 0;

  modal = false;

  carritoVisible = true;

  carrito:any[] = [];

  productos = [
{nombre:"Croissant", precio:42, categoria:"pan", img:"/croissant.jpg"},
{nombre:"Garibaldi", precio:43, categoria:"pan", img:"/garibaldi.jpg"},
{nombre:"Chocolatin", precio:75, categoria:"pan", img:"/chocolatin.jpg"},

{nombre:"Club Sandwich", precio:95, categoria:"sandwich", img:"/club.jpg"},
{nombre:"Panini", precio:110, categoria:"sandwich", img:"/panini.jpg"},
{nombre:"Sandwich Jamon", precio:80, categoria:"sandwich", img:"/jamon.jpg"},

{nombre:"Ensalada Cesar", precio:120, categoria:"ensalada", img:"/cesar.jpg"},
{nombre:"Ensalada Verde", precio:95, categoria:"ensalada", img:"/verde.jpg"},

{nombre:"Cafe", precio:35, categoria:"bebida", img:"/cafe.jpg"},
{nombre:"Capuccino", precio:48, categoria:"bebida", img:"/capuccino.jpg"},
{nombre:"Jugo Natural", precio:40, categoria:"bebida", img:"/jugo.jpg"},

{nombre:"Paquete Desayuno", precio:150, categoria:"paquete", img:"/desayuno.jpg"},
{nombre:"Paquete Pareja", precio:250, categoria:"paquete", img:"/pareja.jpg"}
];

  agregar(producto:any){
    this.total += producto.precio;
    this.carrito.push(producto);
  }

  abrir(){
    this.modal = true;
  }

  cerrar(){
    this.modal = false;
  }

  toggleCarrito(){
    this.carritoVisible = !this.carritoVisible;
  }
}