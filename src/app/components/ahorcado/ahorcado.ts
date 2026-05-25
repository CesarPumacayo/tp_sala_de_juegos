import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PalabraService } from '../../services/palabra-service';
import { AuthService } from '../../services/auth'; // <--- new
import { SupabaseService } from '../../services/supabase';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-ahorcado',
  imports: [CommonModule, RouterLink],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css',
})
export class Ahorcado implements OnInit {
  private palabraService = inject(PalabraService);
  private auth = inject(AuthService); // < -- new 
  private supabase = inject(SupabaseService);
  palabra = signal<string>('');
  letrasUsadas = signal<string[]>([]);
  maxErrores = 6;
  tiempoInicio = 0;

  letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

  errores = computed(() =>
    this.letrasUsadas().filter(l => !this.palabra().includes(l)).length
  );

  palabraMostrada = computed(() =>
    this.palabra().split('').map(l => this.letrasUsadas().includes(l) ? l : '_').join(' ')
  );

  juegoTerminado = computed(() =>
    this.errores() >= this.maxErrores ||
    this.palabra().split('').every(l => this.letrasUsadas().includes(l))
  );

  gano = computed(() =>
    this.palabra().split('').every(l => this.letrasUsadas().includes(l))
  );

  async ngOnInit() {
    await this.nuevaPartida();
  }

  async nuevaPartida() {
    const palabra = await this.palabraService.getPalabra();
    this.palabra.set(palabra);
    this.letrasUsadas.set([]);
    this.tiempoInicio = Date.now();
  }

  elegirLetra(letra: string) {
    if (this.juegoTerminado() || this.letrasUsadas().includes(letra)) return;
    this.letrasUsadas.update(prev => [...prev, letra]);

    if (this.juegoTerminado()) {
      this.guardarResultado();
    }
  }

async guardarResultado() {

  const tiempoFinal = Math.floor(
    (Date.now() - this.tiempoInicio) / 1000
  );

  const userEmail = this.auth.user()?.email ?? 'Invitado';

  const { error } = await this.supabase
  .getClient()
    .from('resultados_ahorcado')
    .insert({
      user_email: userEmail,
      palabra: this.palabra(),
      errores: this.errores(),
      letras_usadas: this.letrasUsadas().length,
      tiempo_segundos: tiempoFinal,
      gano: this.gano()
    });

  if(error) {

    console.log(error);

  } else {

    console.log('Resultado guardado');

  }
}
}