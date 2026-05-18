import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-registro',
  imports: [CommonModule,FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private router = inject(Router);
  private auth = inject(AuthService); 
  nombre = '';
  apellido = '';
  edad = 0;
  email = '';  
  password = '';

  loading = signal(false);  
  errorMensaje = signal(''); 


  async onSubmit(){
    this.loading.set(true);

    this.errorMensaje.set('');
  
    const success = await this.auth.registro(
      this.email,
      this.password,
      this.nombre,
      this.apellido,
      this.edad
    );   
     if (success) {

      this.router.navigate(['/bienvenida']);

    } else {

      this.errorMensaje.set('El usuario ya existe o hubo un error');

    }
    this.loading.set(false);
  }
}
  