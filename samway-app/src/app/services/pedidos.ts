// src/app/services/pedidos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private url = 'http://127.0.0.1:5000/api/pedidos';

  constructor(private http: HttpClient) { }

  // Cambiamos el nombre para que coincida con lo que pide el modal.ts
  agregarPedido(pedido: any): Observable<any> {
    return this.http.post(this.url, pedido);
  }

  obtenerPedidos(): Observable<any> {
    return this.http.get(this.url);
  }

  actualizarEstado(id: string, estado: string): Observable<any> {
    return this.http.put(`${this.url}/${id}`, { estado });
  }

  eliminarPedido(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}