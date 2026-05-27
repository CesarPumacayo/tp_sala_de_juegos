import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PalabraService } from '../../services/palabra-service';
import { AuthService } from '../../services/auth';
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
  private auth = inject(AuthService);
  private supabase = inject(SupabaseService);

  palabra = signal<string>('');
  letrasUsadas = signal<string[]>([]);
  racha = signal(0);
  maxErrores = 6;
  tiempoInicio = 0;
  juegoFinalizado = signal(false);

  letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

  errores = computed(() =>
    this.letrasUsadas().filter(l => !this.palabra().includes(l)).length
  );

  palabraMostrada = computed(() =>
    this.palabra().split('').map(l => this.letrasUsadas().includes(l) ? l : '_').join(' ')
  );

  adivinoRonda = computed(() =>
    this.palabra().split('').every(l => this.letrasUsadas().includes(l))
  );

  perdioRonda = computed(() =>
    this.errores() >= this.maxErrores
  );

  async ngOnInit() {
    this.tiempoInicio = Date.now();
    await this.nuevaRonda();
  }

  async nuevaRonda() {
    const palabra = await this.palabraService.getPalabra();
    this.palabra.set(palabra);
    this.letrasUsadas.set([]);
  }

  elegirLetra(letra: string) {
    if (this.adivinoRonda() || this.perdioRonda() || this.juegoFinalizado()) return;
    this.letrasUsadas.update(prev => [...prev, letra]);

    if (this.adivinoRonda()) {
      this.racha.update(v => v + 1);
      setTimeout(async () => {
        await this.nuevaRonda();
      }, 1000);
    }

    if (this.perdioRonda()) {
      this.juegoFinalizado.set(true);
      this.guardarResultado();
    }
  }

  async guardarResultado() {
    const tiempoFinal = Math.floor((Date.now() - this.tiempoInicio) / 1000);
    const usuario = this.auth.user();

    const { error } = await this.supabase.getClient()
      .from('resultados_ahorcado')
      .insert({
        usuario_id: usuario?.id,
        user_email: usuario?.email,
        palabra: this.palabra(),
        errores: this.errores(),
        letras_usadas: this.letrasUsadas().length,
        tiempo_segundos: tiempoFinal,
        gano: this.racha() > 0,
        puntaje: this.racha()
      });

    if (error) console.log(error);
    else console.log('Resultado guardado');
  }
  async reiniciar() {
    this.racha.set(0);
    this.juegoFinalizado.set(false);
    this.tiempoInicio = Date.now();
    await this.nuevaRonda();
}
}