import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Registro } from './components/registro/registro';
import { Bienvenida } from './components/bienvenida/bienvenida';
import { QuienSoy } from './components/quien-soy/quien-soy';

export const routes: Routes = [
    {path: '', redirectTo: 'bienvenida', pathMatch: 'full'},
    {path: "login", component: Login },
    {path: "registro", component: Registro },
    {path: "bienvenida", component:Bienvenida},
    {path: "quien-soy" , component:QuienSoy},
    {path:"**", redirectTo: "bienvenida"}

];
