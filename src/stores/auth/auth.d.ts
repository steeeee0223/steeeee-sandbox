import { User } from "firebase/auth";

export interface AuthState {
    user: User | null;
    isLoggedIn: boolean;
}
