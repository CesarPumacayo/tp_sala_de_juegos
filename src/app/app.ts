import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routeAnimations } from './animations/route-animations';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  animations: [routeAnimations]
})
export class App {
  protected readonly title = signal('sala_juegos');

  getRouteState(outlet: RouterOutlet) {
      return outlet.isActivated ? outlet.activatedRoute?.snapshot?.url[0]?.path : '';
  }
}