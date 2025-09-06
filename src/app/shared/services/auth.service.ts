import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly ROLE_KEY = 'user_role';
    private readonly SESSION_KEY = 'supabase_session';

    /* --------------------  Rol  -------------------- */
    getRole(): string {
        return localStorage.getItem(this.ROLE_KEY) ?? 'comprador';
    }

    setRole(role: string): void {
        localStorage.setItem(this.ROLE_KEY, role);
    }

    clearRole(): void {
        localStorage.removeItem(this.ROLE_KEY);
    }

    isAdmin(): boolean {
        return this.getRole() === 'admin';
    }

    /* --------------------  Sesión  -------------------- */
    getSession(): string | null {
        return localStorage.getItem(this.SESSION_KEY);
    }

    clearSession(): void {
        localStorage.removeItem(this.SESSION_KEY);
    }

    isSesion(): boolean {
        return !!this.getSession();
    }

    getCurrentUserId(): string | null {
        const raw = localStorage.getItem('supabase_session');
        if (!raw) return null;
        try {
            const session = JSON.parse(raw);
            return session.id || null;
        } catch {
            return null;
        }
    }
}