import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { SupabaseService } from '../../services/supabase';
import { Carta } from '../../models/carta.models';
import { RouterLink } from '@angular/router';
import { MazoService } from '../../services/mazo-service';

@Component({
  selector: 'app-mayor-o-menor',
  imports: [CommonModule, RouterLink],
  templateUrl: './mayor-o-menor.html',
  styleUrl: './mayor-o-menor.css',
})
export class MayorOMenor implements OnInit {

  private auth = inject(AuthService);
  private supabase = inject(SupabaseService);
  private mazoService = inject(MazoService);
  private intervalo: any;

  mazo: Carta[] = [];
  cartaActual = signal<Carta | null>(null);
  cartaSiguiente = signal<Carta | null>(null);
  aciertos = signal(0);
  errores = signal(0);
  indice = signal(0);
  juegoTerminado = signal(false);
  mensajeResultado = signal('');
  tiempoInicio = 0;
  tiempoFinal = signal(0);
  tiempoTranscurrido = signal(0);
  puntaje = signal(0);

  ngOnInit() {
    this.iniciarJuego();
  }

  iniciarJuego() {
    this.mazo = this.mazoService.generarMazo();
    this.aciertos.set(0);
    this.errores.set(0);
    this.indice.set(0);
    this.puntaje.set(0);
    this.juegoTerminado.set(false);
    this.mensajeResultado.set('');
    this.cartaActual.set(this.mazo[0]);
    this.cartaSiguiente.set(null);
    this.tiempoInicio = Date.now();
    clearInterval(this.intervalo);
    this.tiempoTranscurrido.set(0);
    this.intervalo = setInterval(() => {
      this.tiempoTranscurrido.update(v => v + 1);
    }, 1000);
  }

  elegir(eleccion: 'mayor' | 'menor') {
    const actual = this.cartaActual();
    const siguiente = this.mazo[this.indice() + 1];

    if (!actual || !siguiente) return;

    this.cartaSiguiente.set(siguiente);

    const esMayor = siguiente.valor > actual.valor;
    const acerto = (eleccion === 'mayor' && esMayor) || (eleccion === 'menor' && !esMayor);

    if (acerto) {
      this.aciertos.update(v => v + 1);
      this.puntaje.update(v => v + 10);
      this.mensajeResultado.set('✅ ¡Correcto!');
    } else {
      this.errores.update(v => v + 1);
      this.puntaje.update(v => v - 5);
      this.mensajeResultado.set('❌ ¡Incorrecto!');
    }

    if (this.indice() + 1 >= this.mazo.length - 1 || this.indice() + 1 >= 5) {
      this.juegoTerminado.set(true);
      this.guardarResultado();
    } else {
      setTimeout(() => {
        this.indice.update(v => v + 1);
        this.cartaActual.set(this.mazo[this.indice()]);
        this.cartaSiguiente.set(null);
        this.mensajeResultado.set('');
      }, 1000);
    }
  }

  async guardarResultado() {
    clearInterval(this.intervalo);
    const tiempo = Math.floor((Date.now() - this.tiempoInicio) / 1000);
    this.tiempoFinal.set(tiempo);
    const usuario = this.auth.user();

    const { error } = await this.supabase.getClient()
      .from('resultados_mayor_menor')
      .insert({
        usuario_id: usuario?.id,
        user_email: usuario?.email,
        aciertos: this.aciertos(),
        errores: this.errores(),
        tiempo_segundos: tiempo,
        puntaje: this.puntaje()
      });

    if (error) console.log(error);
    else console.log('Resultado guardado');
  }
}