import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PalabraService {

  private palabras = ['ANGULAR', 'TYPESCRIPT', 'COMPONENT', 'SERVICE', 'SIGNAL', 'DEVELOPER', 'SYSTEM']

  async getPalabra(): Promise<string> {
    const indice = Math.floor(Math.random() * this.palabras.length);
    return this.palabras[indice];
  }
}