import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidosService } from '../../services/pedidos';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos.html',
  styleUrls: ['./pedidos.css']
})
export class PedidosComponent {

  pedidos: any[] = [];

  constructor(private pedidosService: PedidosService){
    this.pedidos = this.pedidosService.obtenerPedidos();
  }

  cambiarEstado(i: number, estado: string){
    this.pedidos[i].estado = estado;
  }

}