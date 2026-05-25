export interface User { // <-- Usuarios Auth Supabase
  id: string;
  email: string;
  role?: string;
  
}

export interface Usuario { // <-- Datos Github 
  name: string;
  location: string;
  public_repos: number;
  avatar_url?: string;
  html_url?: string;
  blog: string;
}

export interface UsuarioDB { // <-- tabla de Usuarios - mensajes 
  id: string;
  nombre: string;
  apellido: string;
  edad: number;
  email: string;
  created_at?: string;
}