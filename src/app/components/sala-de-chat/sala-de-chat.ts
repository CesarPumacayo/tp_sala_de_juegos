import { Component, inject } from '@angular/core';
import { ChatService } from '../../services/chat-services';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-sala-de-chat',
  imports: [FormsModule, DatePipe, RouterLink],
  templateUrl: './sala-de-chat.html',
  styleUrl: './sala-de-chat.css',
})
export class SalaDeChat {
  chatService = inject(ChatService);
  authService = inject(AuthService);
  nuevoMensaje = '';

  async enviarMensaje() {
    const texto = this.nuevoMensaje.trim();
    const usuario = this.authService.user();
    if (texto && usuario) {
      await this.chatService.enviarMensajeConUsuario(texto, usuario.id, usuario.email);      
      this.nuevoMensaje = '';
    }
  }
}