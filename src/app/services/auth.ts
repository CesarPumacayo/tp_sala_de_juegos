import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User, UsuarioDB } from '../models/user.models';
import { SupabaseService } from './supabase';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    private router = inject(Router);
    private supabase = inject(SupabaseService);

    user = signal<User | null>(null);
    isAuthenticated = computed(() => this.user() !== null);
    userEmail = computed(() => this.user()?.email ?? 'Invitado');
    isAdmin = signal(false);

    

    constructor(){
        this.checkSession();
    }

    async checkSession(){ 
        const {data: {session}} = await this.supabase.getClient().auth.getSession(); 
        if(session?.user) {
            this.user.set({ 
                id: session.user.id,
                email: session.user.email ?? ''
            });
            await this.cargarIsAdmin(session.user.id);
        }
    }

    async cargarIsAdmin(userId: string) {
        const { data } = await this.supabase.getClient()
            .from('usuarios')
            .select('is_admin')
            .eq('id', userId)
            .single();
        this.isAdmin.set(data?.is_admin ?? false);
    }

    async logout(): Promise<void> {
        await this.supabase.getClient().auth.signOut();
        this.user.set(null);
        this.router.navigate(['/login']);
    }

    async login(email: string, password: string): Promise<boolean> {
        const { data, error } = await this.supabase.getClient().auth.signInWithPassword({email, password});
         if(error) {
            Swal.fire({
                title: 'Ocurrió un error en iniciar sesion!',
                icon: 'error',
                text: "credenciales incorrectas",
            });
            return false;
        }


      if(data.user){
            Swal.fire({
                title: 'Inicio exitoso!',
                icon: 'success',
                text: '¡Bienvenido a la Sala de Juegos!',
                timer: 1500,
                showConfirmButton: false
            });
            this.user.set({id: data.user.id, email: data.user.email ?? ''});
            await this.cargarIsAdmin(data.user.id);
            return true;
        }
        return false;
    }

    async registro(email: string, password: string, nombre: string, apellido: string, edad: number): Promise<boolean> {
        const { data, error } = await this.supabase.getClient().auth.signUp({ 
            email, 
            password, 
            options: {
                data: { nombre, apellido, edad }
            } 
        });

        if(error) {
            Swal.fire({
                title: 'Algo salió mal',
                icon: 'error',
                text: error.message,
            });
            return false;
        }

        if(data.user){
            const nuevoUsuario: UsuarioDB = {
                id: data.user.id,
                nombre,
                apellido,
                edad,
                email

            };
            await this.supabase
                .getClient()
                .from('usuarios')
                .insert([nuevoUsuario]);
            Swal.fire({
                title: '¡Registro exitoso!',
                icon: 'success',
                text: '¡Bienvenido a la Sala de Juegos!',
                timer: 1500,
                showConfirmButton: false
            });
            this.user.set({id: data.user.id, email: data.user.email ?? ''});

            return true;
        }

        return false;
    }
}