import { Component } from '@angular/core';
import { ProductosComponent } from '../productos/productos';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [ProductosComponent],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class MenuComponent {

}