import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-encuesta-resultados',
  imports: [CommonModule, RouterLink],
  templateUrl: './encuesta-resultados.html',
  styleUrl: './encuesta-resultados.css',
})
export class EncuestaResultados implements OnInit {

  private supabase = inject(SupabaseService);
  encuestas = signal<any[]>([]);

  async ngOnInit() {
    const { data } = await this.supabase.getClient()
      .from('encuestas')
      .select('*')
      .order('created_at', { ascending: false });

    this.encuestas.set(data ?? []);
  }
}