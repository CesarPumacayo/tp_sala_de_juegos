import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.models';
import { SupabaseService } from './supabase';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    private router = inject(Router);
    private supabase = inject(SupabaseService);

    user = signal<User | null>(null) 
    isAuthenticated = computed(() => this.user() !== null); 
    userEmail = computed(()=> this.user()?.email ?? 'Invitado');
    constructor(){
    this.checkSession();
    }
    async checkSession(){ 
        const {data: {session}} = await this.supabase.getClient().auth.getSession(); 
        if(session?.user) 
        {
        
            this.user.set({ 
                id:session.user.id,
                email: session.user.email?? ''

            })
            
        }
        
    }
    
    
    async logout(): Promise<void> {
        
        await this.supabase.getClient().auth.signOut();
        
        this.user.set(null);
        
        this.router.navigate(['/login']);
        
    } 
    async login(email:string, password:string):Promise<boolean> 
    {
        const{data, error} = await this.supabase.getClient().auth.signInWithPassword({email, password});
        if(error) return false;
        if(data.user){
            this.user.set({id:data.user.id, email: data.user.email ?? ''});
            return true;
        }
        return false; 
    }
    
    async registro(email: string,password: string,nombre: string,apellido: string,edad: number): Promise<boolean> {
        const { data, error } = await this.supabase.getClient().auth.signUp({ email, password, 
            options: {
            data: {
                nombre,
                apellido,
                edad
            }
        } });
        if(error) return false;

        if(data.user){
            this.user.set({id:data.user.id, email: data.user.email ?? ''});
            return true;
        }

        return false;
    }
}    


