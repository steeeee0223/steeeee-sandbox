export interface AuthState {
    isLoggedIn: boolean;
    user: string;
    userId: string;
}

export enum AuthActionTypes {
    SET_USER = "SET_USER",
    RESET_USER = "RESET_USER",
}
