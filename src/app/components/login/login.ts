import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({selector: 'app-login',
  imports: [  CommonModule,  RouterLink,  ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {

  private router = inject(Router);
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);

  loading = signal(false);
  errorMensaje = signal('');

  loginForm = this.fb.group({

    email: ['', [ Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]

  });

  async onSubmit() {

    if(this.loginForm.invalid){

      this.loginForm.markAllAsTouched();
      return;

    }

    this.loading.set(true);
    this.errorMensaje.set('');

    const email = this.loginForm.value.email ?? '';
    const password = this.loginForm.value.password ?? '';

    const success = await this.auth.login(email, password);

    if(success){

      this.router.navigate(['/bienvenida']);

    }else{

      this.errorMensaje.set('Credenciales incorrectas');

    }

    this.loading.set(false);
  }

  loginRapidoPepe(){

    this.loginForm.patchValue({
      email: 'pepe@gmail.com',
      password: 'yosoypepe'
    });

  }

  loginRapidoTomas(){

    this.loginForm.patchValue({//actualiza los inputs correctamente
      email: 'tomas@gmail.com',
      password: 'tomas123'
    });
  // await this.onSubmit();

  }

  loginRapidoJorge(){

    this.loginForm.patchValue({
      email: 'jorge@gmail.com',
      password: 'jorge123'
    });

  }

}