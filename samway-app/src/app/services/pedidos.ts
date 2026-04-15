import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  // --- CAMBIO DE URLS PARA PRODUCCIÓN ---
  // Cuando Render te de tu URL, sustituye 'tu-app-en-render.onrender.com' por la real.
  private apiBase = 'https://tu-app-en-render.onrender.com/api';

  private urlPedidos = `${this.apiBase}/pedidos`;
  private urlNewsletter = `${this.apiBase}/newsletter`;
  private urlProductos = `${this.apiBase}/productos`;

  constructor(private http: HttpClient) { }

  // --- GESTIÓN DE PEDIDOS ---
  agregarPedido(pedido: any): Observable<any> {
    return this.http.post(this.urlPedidos, pedido);
  }

  obtenerPedidos(): Observable<any> {
    return this.http.get(this.urlPedidos);
  }

  actualizarEstado(id: string, estado: string): Observable<any> {
    return this.http.put(`${this.urlPedidos}/${id}`, { estado });
  }

  eliminarPedido(id: string): Observable<any> {
    return this.http.delete(`${this.urlPedidos}/${id}`);
  }

  // --- GESTIÓN DE NEWSLETTER ---
  registrarNewsletter(correo: string): Observable<any> {
    return this.http.post(this.urlNewsletter, { correo });
  }

  obtenerNewsletter(): Observable<any> {
    return this.http.get(this.urlNewsletter);
  }

  // --- GESTIÓN DE PRODUCTOS (CRUD COMPLETO) ---
  obtenerProductos(): Observable<any> {
    return this.http.get(this.urlProductos);
  }

  crearProducto(producto: any): Observable<any> {
    return this.http.post(this.urlProductos, producto);
  }

  actualizarProducto(id: string, producto: any): Observable<any> {
    return this.http.put(`${this.urlProductos}/${id}`, producto);
  }

  eliminarProducto(id: string): Observable<any> {
    return this.http.delete(`${this.urlProductos}/${id}`);
  }
}