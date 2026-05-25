import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-resultados',
  imports: [CommonModule, RouterLink],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css',
})
export class Resultados implements OnInit {

  private supabase = inject(SupabaseService);

  resultadosAhorcado = signal<any[]>([]);
  resultadosMayorMenor = signal<any[]>([]);
  resultadosPreguntados = signal<any[]>([]);
  resultadosJuegoPropio = signal<any[]>([]);

  async ngOnInit() {

    await this.cargarAhorcado();
    await this.cargarMayorMenor();
    await this.cargarPreguntados();
    await this.cargarJuegoPropio();

  }

  async cargarAhorcado() {

    const { data } = await this.supabase
      .getClient()
      .from('resultados_ahorcado')
      .select('*')
      .order('puntaje', { ascending: false })
      .order('errores', { ascending: true })
      .order('tiempo_segundos', { ascending: true });

    this.resultadosAhorcado.set(data ?? []);

}

  async cargarMayorMenor() {

    const { data, error } = await this.supabase
      .getClient()
      .from('resultados_mayor_menor')
      .select('*')
      .order('aciertos', { ascending: false })
      .order('errores', { ascending: true })
      .order('tiempo_segundos', { ascending: true });

    if (!error) {

      this.resultadosMayorMenor.set(data ?? []);

    }

  }



  async cargarPreguntados() {

    const { data } = await this.supabase
      .getClient()
      .from('resultados_preguntados')
      .select('*')
      .order('puntaje', { ascending: false });

    this.resultadosPreguntados.set(data ?? []);

  }

  async cargarJuegoPropio() {

    const { data, error } = await this.supabase
      .getClient()
      .from('resultados_juego_propio')
      .select('*')
      .order('puntos', { ascending: false });

    if (!error) {

      this.resultadosJuegoPropio.set(data ?? []);

    }

  }

}