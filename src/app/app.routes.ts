import { Routes } from '@angular/router';
import { authGuard } from './guards/auth';
import { publicGuard } from './guards/public-guard';
import { adminGuard } from './guards/admin-guard';
export const routes: Routes = [
    {path: '', redirectTo: 'bienvenida', pathMatch: 'full'},
    {path: "login", loadComponent: () => import('./components/login/login').then(m => m.Login), canActivate: [publicGuard]},
    {path: "registro", loadComponent: () => import('./components/registro/registro').then(m => m.Registro), canActivate: [publicGuard]},
    {path: "bienvenida", loadComponent: () => import('./components/bienvenida/bienvenida').then(m => m.Bienvenida)},
    {path: "quien-soy", loadComponent: () => import('./components/quien-soy/quien-soy').then(m => m.QuienSoy), canActivate: [authGuard]},
    {path: "ahorcado", loadComponent: () => import('./components/ahorcado/ahorcado').then(m => m.Ahorcado), canActivate: [authGuard]},
    {path: "mayor-menor", loadComponent: () => import('./components/mayor-o-menor/mayor-o-menor').then(m => m.MayorOMenor), canActivate: [authGuard]},
    {path: "preguntados", loadComponent: () => import('./components/preguntados/preguntados').then(m => m.Preguntados), canActivate: [authGuard]},
    {path: "juego-propio", loadComponent: () => import('./components/juego-propio/juego-propio').then(m => m.JuegoPropio), canActivate: [authGuard]},
    {path: "sala-de-chat", loadComponent: () => import('./components/sala-de-chat/sala-de-chat').then(m => m.SalaDeChat), canActivate: [authGuard]},
    {path: "resultados", loadComponent: () => import('./components/resultados/resultados').then(m => m.Resultados), canActivate: [authGuard]},
    {path: "encuesta", loadComponent: () => import('./components/encuesta/encuesta').then(m => m.Encuesta), canActivate: [authGuard]},
    {path: "encuesta-resultados", loadComponent: () => import('./components/encuesta-resultados/encuesta-resultados').then(m => m.EncuestaResultados), canActivate: [adminGuard]},
    {path: "**", redirectTo: "bienvenida"},
];