import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { SupabaseService } from '../../services/supabase';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-encuesta',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './encuesta.html',
  styleUrl: './encuesta.css',
})
export class Encuesta {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  loading = signal(false);

  formulario = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    edad: [null, [Validators.required, Validators.min(18), Validators.max(99)]],
    telefono: ['', [Validators.required, Validators.pattern('^[0-9]{1,10}$')]],
    pregunta1: ['', Validators.required],
    pregunta2: ['', Validators.required],
    pregunta3: ['', Validators.required],
    pregunta4_accion: [false],
    pregunta4_puzzle: [false],
    pregunta4_estrategia: [false],
    pregunta4_deportes: [false],
  });

  async onSubmit() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const usuario = this.auth.user();
    const f = this.formulario.value;

    const generos = [
      f.pregunta4_accion ? 'Acción' : '',
      f.pregunta4_puzzle ? 'Puzzle' : '',
      f.pregunta4_estrategia ? 'Estrategia' : '',
      f.pregunta4_deportes ? 'Deportes' : ''
    ].filter(g => g !== '').join(', ');

    const { error } = await this.supabase.getClient()
      .from('encuestas')
      .insert({
        usuario_id: usuario?.id,
        user_email: usuario?.email,
        nombre: f.nombre,
        apellido: f.apellido,
        edad: f.edad,
        telefono: f.telefono,
        pregunta1: f.pregunta1,
        pregunta2: f.pregunta2,
        pregunta3: f.pregunta3,
        pregunta4: generos
      });

    this.loading.set(false);

    if (error) {
      Swal.fire({ title: 'Error', text: error.message, icon: 'error' });
    } else {
      Swal.fire({
        title: '¡Encuesta enviada!',
        text: 'Gracias por completar la encuesta.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      }).then(() => this.router.navigate(['/bienvenida']));
    }
  }

  get nombre() { return this.formulario.get('nombre')!; }
  get apellido() { return this.formulario.get('apellido')!; }
  get edad() { return this.formulario.get('edad')!; }
  get telefono() { return this.formulario.get('telefono')!; }
  get pregunta1() { return this.formulario.get('pregunta1')!; }
  get pregunta2() { return this.formulario.get('pregunta2')!; }
  get pregunta3() { return this.formulario.get('pregunta3')!; }
  get pregunta4() { return this.formulario.get('pregunta4_accion')!; }
}