import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  // URLs base para las distintas colecciones en Flask
  private urlPedidos = 'http://127.0.0.1:5000/api/pedidos';
  private urlNewsletter = 'http://127.0.0.1:5000/api/newsletter';
  private urlProductos = 'http://127.0.0.1:5000/api/productos';

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
  
  // Para que el Menú Principal cargue los datos de la base de datos
  obtenerProductos(): Observable<any> {
    return this.http.get(this.urlProductos);
  }

  crearProducto(producto: any): Observable<any> {
    return this.http.post(this.urlProductos, producto);
  }

  // 🛠️ MÉTODO NUEVO: Actualiza un producto existente (Soluciona error en Ln 92)
  actualizarProducto(id: string, producto: any): Observable<any> {
    return this.http.put(`${this.urlProductos}/${id}`, producto);
  }

  // 🗑️ MÉTODO NUEVO: Elimina un producto por ID (Soluciona error en Ln 113)
  eliminarProducto(id: string): Observable<any> {
    return this.http.delete(`${this.urlProductos}/${id}`);
  }
}