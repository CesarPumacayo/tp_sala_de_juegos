import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pregunta } from '../../models/preguntados.models';
import { PreguntadoService } from '../../services/preguntados-service';
import { AuthService } from '../../services/auth';
import { SupabaseService } from '../../services/supabase';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-preguntados',
  imports: [CommonModule, RouterLink],
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css',
})
export class Preguntados implements OnInit {

  private preguntadoService = inject(PreguntadoService);
  private auth = inject(AuthService);
  private supabase = inject(SupabaseService);

  preguntas = signal<Pregunta[]>([]); // Guarda las preguntas en el signal y arranca el timer
  indice = signal(0);
  aciertos = signal(0);
  errores = signal(0);
  juegoTerminado = signal(false);
  respuestaSeleccionada = signal<string | null>(null);
  tiempoInicio = 0;

  preguntaActual = computed(() => this.preguntas()[this.indice()]);

  // Llama a la API y por cada pregunta mezcla las opciones con mezclar() para que la correcta no esté siempre en el mismo lugar
  ngOnInit(): void {
      this.preguntadoService.getPreguntados().subscribe(preguntas => {
          this.preguntas.set(preguntas);
          this.tiempoInicio = Date.now();
      });
  }
  mezclar(arr: string[]): string[] {
    return arr.sort(() => Math.random() - 0.5);
  }

  responder(opcion: string) {
    if (this.respuestaSeleccionada()) return;
    this.respuestaSeleccionada.set(opcion);

    if (opcion === this.preguntaActual().correct_answer) {
      this.aciertos.update(v => v + 1);
    } else {
      this.errores.update(v => v + 1);
    }

    setTimeout(() => {
      if (this.indice() + 1 >= this.preguntas().length) {
        this.juegoTerminado.set(true);
        this.guardarResultado();
      } else {
        this.indice.update(v => v + 1);
        this.respuestaSeleccionada.set(null);
      }
    }, 1000);
  }

  esCorrecta(opcion: string): boolean {
    return this.respuestaSeleccionada() !== null && opcion === this.preguntaActual().correct_answer;
  }

  esIncorrecta(opcion: string): boolean {
    return this.respuestaSeleccionada() === opcion && opcion !== this.preguntaActual().correct_answer;
  }

  async guardarResultado() {
    const tiempo = Math.floor((Date.now() - this.tiempoInicio) / 1000);
    const usuario = this.auth.user();
    const puntos =
      (this.aciertos() * 20) -
      (this.errores() * 5);

    const { error } = await this.supabase.getClient()
      .from('resultados_preguntados')
      .insert({
        usuario_id: usuario?.id,
        user_email: usuario?.email,
        aciertos: this.aciertos(),
        errores: this.errores(),
        tiempo_segundos: tiempo,
        puntaje:puntos 
      });

    if (error) console.log(error);
    else console.log('Resultado guardado');
  }

  reiniciarJuego() {
    this.indice.set(0);
    this.aciertos.set(0);
    this.errores.set(0);
    this.juegoTerminado.set(false);
    this.respuestaSeleccionada.set(null);
    this.preguntadoService.getPreguntados().subscribe(preguntas => {
        this.preguntas.set(preguntas);
        this.tiempoInicio = Date.now();
    });
  }
}