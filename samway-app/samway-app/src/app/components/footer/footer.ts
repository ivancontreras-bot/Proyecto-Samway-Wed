import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class FooterComponent {
  suscribir() {
    alert('¡Gracias por suscribirte a nuestro Newsletter!');
  }
}