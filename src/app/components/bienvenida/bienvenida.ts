import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-bienvenida',
  imports: [RouterLink, CommonModule],
  templateUrl: './bienvenida.html',
  styleUrl: './bienvenida.css',
})
export class Bienvenida {
    authService = inject(AuthService); 

}
