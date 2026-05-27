import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth";
import { SupabaseService } from "../services/supabase";

export const adminGuard: CanActivateFn = async () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const supabase = inject(SupabaseService);

    await auth.checkSession();

    if (!auth.isAuthenticated()) {
        router.navigate(['/login']);
        return false;
    }

    const { data } = await supabase.getClient()
        .from('usuarios')
        .select('is_admin')
        .eq('id', auth.user()?.id)
        .single();

    if (data?.is_admin) {
        return true;
    }

    router.navigate(['/bienvenida']);
    return false;
}