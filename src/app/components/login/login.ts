import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule], // commonModule -> [disabled] login.html
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  private auth = inject(AuthService); 
  email = '';
  password = '';
 
  loading = signal(false); 

  errorMensaje = signal(''); 

  async onSubmit(){
    this.loading.set(true);
    this.errorMensaje.set('');

    const success = await this.auth.login(this.email, this.password); 

     if (success) {

      this.router.navigate(['/bienvenida']);

    } else {

      this.errorMensaje.set("Credenciales incorrectas");

    }
    this.loading.set(false);
  }

  async loginRapidoBeto() {

  this.email = 'pepe@gmail.com';
  this.password = 'yosoypepe';

  await this.onSubmit();


}

async loginRapidoTomas() {

  this.email = 'tomas@gmail.com';
  this.password = 'tomas123';

  await this.onSubmit();


}

async loginRapidoJorge() {

  this.email = 'jorge@gmail.com';
  this.password = 'jorge123';

  await this.onSubmit();
}
}
