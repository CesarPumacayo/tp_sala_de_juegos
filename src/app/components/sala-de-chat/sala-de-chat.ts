import { Component, inject, OnInit, ElementRef, ViewChild, effect } from '@angular/core';
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


 

export class SalaDeChat implements OnInit {
    
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  chatService = inject(ChatService);
  authService = inject(AuthService);
  nuevoMensaje = '';
  coloresUsuario: { [email: string]: string } = {};
  colores = ['#e74c3c', '#3498db', '#9b59b6', '#e67e22', '#1abc9c', '#f39c12'];

  constructor() {
    effect(() => {
        this.chatService.mensajes();
        setTimeout(() => this.scrollAlFinal(), 100);
    });
}

  async ngOnInit() {
      await this.chatService.cargarMensajesIniciales();
      this.chatService.escucharMensajesEnTiempoReal();
      setTimeout(() => this.scrollAlFinal(), 100);
  }



  scrollAlFinal() {
    if (this.messagesContainer) {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  getColorUsuario(email: string): string {
    if (!this.coloresUsuario[email]) {
      const indice = Object.keys(this.coloresUsuario).length % this.colores.length;
      this.coloresUsuario[email] = this.colores[indice];
    }
    return this.coloresUsuario[email];
  }

  async enviarMensaje() {
    const texto = this.nuevoMensaje.trim();
    const usuario = this.authService.user();
    if (texto && usuario) {
      await this.chatService.enviarMensajeConUsuario(texto, usuario.id, usuario.email);
      this.nuevoMensaje = '';
    }
  }
}