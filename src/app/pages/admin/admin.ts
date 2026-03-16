import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidosService } from '../../services/pedidos';

@Component({
  selector:'app-admin',
  standalone:true,
  imports:[CommonModule],
  templateUrl:'./admin.html',
  styleUrl:'./admin.css'
})
export class AdminComponent{

  pedidos:any[]=[]

  constructor(private pedidosService:PedidosService){

    this.pedidos=this.pedidosService.obtenerPedidos()

  }

}