import { Injectable } from '@angular/core';

@Injectable({
providedIn: 'root'
})

export class PedidosService {

pedidos:any[] = [];

constructor(){

const data = localStorage.getItem("pedidos");

if(data){
this.pedidos = JSON.parse(data);
}

}

agregarPedido(pedido:any){

this.pedidos.push(pedido);

localStorage.setItem("pedidos", JSON.stringify(this.pedidos));

}

obtenerPedidos(){
return this.pedidos;
}

}