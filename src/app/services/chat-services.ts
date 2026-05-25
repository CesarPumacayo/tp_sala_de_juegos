import { inject, Injectable, signal } from "@angular/core";
import { Mensaje } from "../models/mensaje.models";
import { SupabaseService } from "./supabase";

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private supabaseService = inject(SupabaseService);
    private get supabase() { return this.supabaseService.getClient(); }
    public mensajes = signal<Mensaje[]>([]);

    constructor() {
        this.cargarMensajesIniciales();
        this.escucharMensajesEnTiempoReal();
    }

    async cargarMensajesIniciales() {
        const { data } = await this.supabase
            .from('mensajes')
            .select('*')
            .order('created_at', { ascending: true });
        
        if (data) this.mensajes.set(data as Mensaje[]);
    }

    escucharMensajesEnTiempoReal() {
        this.supabase
            .channel('sala-publica')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensajes' }, 
            async () => {
                this.cargarMensajesIniciales(); 
            })
            .subscribe();
    }

    async enviarMensajeConUsuario(contenido: string, userId: string, userEmail: string) {
        await this.supabase.from('mensajes').insert({
            contenido,
            user_id: userId,
            user_email: userEmail
        });
    }
}