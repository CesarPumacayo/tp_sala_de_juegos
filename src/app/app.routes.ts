import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Registro } from './components/registro/registro';
import { Bienvenida } from './components/bienvenida/bienvenida';
import { QuienSoy } from './components/quien-soy/quien-soy';
import { authGuard } from './guards/auth';
import { publicGuard } from './guards/public-guard';
import { Ahorcado } from './components/ahorcado/ahorcado';
import { MayorOMenor } from './components/mayor-o-menor/mayor-o-menor';
import { SalaDeChat } from './components/sala-de-chat/sala-de-chat';
import { Preguntados } from './components/preguntados/preguntados';
import { JuegoPropio } from './components/juego-propio/juego-propio';
import { Resultados } from './components/resultados/resultados';

export const routes: Routes = [
    {path: '', redirectTo: 'bienvenida', pathMatch: 'full'},
    {path: "login", component: Login, canActivate: [publicGuard]},
    {path: "registro", component: Registro, canActivate: [publicGuard]},
    {path: "bienvenida", component: Bienvenida},
    {path: "quien-soy", component: QuienSoy, canActivate: [authGuard]},
    {path: "ahorcado", component: Ahorcado,  canActivate: [authGuard]},
    {path: "mayor-menor", component:MayorOMenor,  canActivate: [authGuard]},
    {path: "sala-de-chat" , component:SalaDeChat,  canActivate: [authGuard]},
    {path: "preguntados", component: Preguntados,  canActivate: [authGuard]},
    {path: "juego-propio", component:JuegoPropio, canActivate: [authGuard]},
    {path: "resultados", component:Resultados, canActivate: [authGuard]},

    {path: "**", redirectTo: "bienvenida"},
    
];
