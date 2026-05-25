import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { SupabaseService } from '../../services/supabase';
import { RouterLink } from '@angular/router';
import { Emoji } from '../../models/juego_propio.models';
@Component({
  selector: 'app-juego-propio',
  imports: [CommonModule, RouterLink],
  templateUrl: './juego-propio.html',
  styleUrl: './juego-propio.css',
})
export class JuegoPropio implements OnInit, OnDestroy {

  private auth = inject(AuthService);
  private supabase = inject(SupabaseService);

  emojis = signal<Emoji[]>([]);
  puntos = signal(0);
  reloj = signal(3);
  juegoTerminado = signal(false);
  tiempoInicio = 0;
  private intervaloSpawn: any;
  private intervalosDesaparicion: any[] = [];
  private idContador = 0;

  emojisList = ['😈', '👻', '🎃', '💀', '🔥', '⚡', '🌟', '🎯', '💎', '🚀'];

  ngOnInit() {
    this.iniciarJuego();
  }

  ngOnDestroy() {
    this.limpiarIntervalos();
  }

  iniciarJuego() {

    this.emojis.set([]);
    this.puntos.set(0);

    // TIEMPO TOTAL DE PARTIDA
    this.reloj.set(10);

    this.juegoTerminado.set(false);
    this.tiempoInicio = Date.now();

    this.limpiarIntervalos();

    // SPAWN DE EMOJIS
    this.intervaloSpawn = setInterval(() => {

      if (!this.juegoTerminado()) {
        this.spawnEmoji();
      }

    }, 700);

    // RELOJ REAL
    const intervaloTiempo = setInterval(() => {

      this.reloj.update(v => v - 1);

      if (this.reloj() <= 0) {

        clearInterval(intervaloTiempo);
        this.terminarJuego();

      }

    }, 1000);

    this.intervalosDesaparicion.push(intervaloTiempo);
  }

  spawnEmoji() {

    const id = this.idContador++;

    const emoji: Emoji = {
      id,
      simbolo: this.emojisList[
        Math.floor(Math.random() * this.emojisList.length)
      ],
      x: Math.random() * 80 + 5,
      y: Math.random() * 70 + 5
    };

    this.emojis.update(prev => [...prev, emoji]);

    const timeout = setTimeout(() => {

      this.emojis.update(prev =>
        prev.filter(e => e.id !== id)
      );

    }, 1000);

    this.intervalosDesaparicion.push(timeout);
  }

  atrapar(id: number) {
    this.emojis.update(prev => prev.filter(e => e.id !== id));
    this.puntos.update(v => v + 10);
  }

  terminarJuego() {
    this.juegoTerminado.set(true);
    this.limpiarIntervalos();
    this.guardarResultado();
  }

  limpiarIntervalos() {
    clearInterval(this.intervaloSpawn);
    this.intervalosDesaparicion.forEach(t => clearTimeout(t));
    this.intervalosDesaparicion = [];
  }

  async guardarResultado() {
    const tiempo = Math.floor((Date.now() - this.tiempoInicio) / 1000);
    const usuario = this.auth.user();

    const { error } = await this.supabase.getClient()
      .from('resultados_juego_propio')
      .insert({
        usuario_id: usuario?.id,
        user_email: usuario?.email,
        puntos: this.puntos(),
        tiempo_segundos: tiempo
      });

    if (error) console.log(error);
    else console.log('Resultado guardado');
  }
}