import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private router = inject(Router);
  private auth = inject(AuthService); 
  private fb = inject(FormBuilder);

  loading = signal(false);  
  errorMensaje = signal(''); 

  registerForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]], // pattern permite letras y bloquea tanto simbolos como numeros 
    apellido:['',[Validators.required,  Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]], 
    edad: [null, [Validators.required, Validators.min(1)]],
    email: ['', [ Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })




  async onSubmit(){
    if(this.registerForm.invalid){

      this.registerForm.markAllAsTouched();
      return;

    }
    this.loading.set(true);
    this.errorMensaje.set('');

    const formValues = this.registerForm.value;

    const success = await this.auth.registro(

      formValues.email ?? '',
      formValues.password ?? '',
      formValues.nombre ?? '',
      formValues.apellido ?? '',
      Number(formValues.edad)

    );

     if (success) {

      this.router.navigate(['/bienvenida']);

    } else {

      this.errorMensaje.set('El usuario ya existe o hubo un error');

    }
    this.loading.set(false);
  }
}
  