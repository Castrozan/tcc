export interface IAuthService {
    signIn(email: string, password: string): Promise<{ token: string; error?: string }>;
    signOut(): Promise<void>;
}
