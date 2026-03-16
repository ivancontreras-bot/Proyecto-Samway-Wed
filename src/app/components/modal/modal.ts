import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidosService } from '../../services/pedidos';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal.html',
  styleUrls: ['./modal.css']
})

export class ModalComponent {

  @Input() carrito:any[] = [];
  @Input() total:number = 0;

  @Output() cerrar = new EventEmitter();

  nombre = "";
  direccion = "";
  pedidoConfirmado = false;

  constructor(private pedidosService: PedidosService){}

  cerrarModal(){
    this.cerrar.emit();
  }

  confirmar(){

    const pedido = {
      nombre: this.nombre,
      direccion:this.direccion,
      productos:this.carrito,
      total:this.total,
      estado:"Pendiente"
    };

    this.pedidosService.agregarPedido(pedido);

    this.carrito.length = 0;

    this.pedidoConfirmado = true;

  }

}