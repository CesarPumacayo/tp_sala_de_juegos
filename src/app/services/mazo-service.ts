import { Injectable } from '@angular/core';
import { Carta } from '../models/carta.models';

@Injectable({
  providedIn: 'root'
})
export class MazoService {

  private palos = ['🟡', '🏆', '⚔️', '🦯'];
  private nombres = ['', 'As', '2', '3', '4', '5', '6', '7', 'Sota', 'Caballo', 'Rey'];

  generarMazo(): Carta[] {
    let mazo: Carta[] = [];
    for (const palo of this.palos) {
      for (let valor = 1; valor <= 10; valor++) {
        mazo.push({ palo, valor, nombre: this.nombres[valor] });
      }
    }
    return this.mezclarSinRepetidos(mazo);
  }

  private mezclarSinRepetidos(mazo: Carta[]): Carta[] {
    let mezclado = false;
    while (!mezclado) {
      mazo = mazo.sort(() => Math.random() - 0.5);
      mezclado = !mazo.some((carta, i) =>
        i < mazo.length - 1 && carta.valor === mazo[i + 1].valor
      );
    }
    return mazo;
  }
}