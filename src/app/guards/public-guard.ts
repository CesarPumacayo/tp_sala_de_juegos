import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth";

export const publicGuard: CanActivateFn = async () => {
    const auth = inject(AuthService);
    const router = inject(Router);

// garantiza que la sesión esté lista antes de evaluar si el usuario está autenticado, 
// ya que (auth.ts)el constructor no espera la sesión
    await auth.checkSession();
    
    if(auth.isAuthenticated()) {
        router.navigate(['/bienvenida']);
        return false;
    }
    return true;
}