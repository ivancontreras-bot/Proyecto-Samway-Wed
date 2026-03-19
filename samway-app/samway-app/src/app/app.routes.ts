import { Routes } from '@angular/router';

import { MenuComponent } from './components/menu/menu';
import { LoginComponent } from './pages/login/login';
import { AdminComponent } from './pages/admin/admin';
import { PedidosComponent } from './pages/pedidos/pedidos';

export const routes: Routes = [

  { path: "", redirectTo: "menu", pathMatch: "full" },

  { path: "menu", component: MenuComponent },

  { path: "login", component: LoginComponent },

  { path: "admin", component: AdminComponent },

  { path: "pedidos", component: PedidosComponent },

  { path: "**", redirectTo: "menu" }

];