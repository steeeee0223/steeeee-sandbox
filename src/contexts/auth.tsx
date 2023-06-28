import {
    GithubAuthProvider,
    GoogleAuthProvider,
    User,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
} from "firebase/auth";

import { createCtx } from "@/hooks";
import { auth } from "@/config/firebase";
import { useEffect, useState } from "react";

interface AuthContextInterface {
    user: User | null;
    googleSignIn: () => void;
    githubSignIn: () => void;
    logOut: () => Promise<void>;
}

export const [useAuthContext, AuthContextProvider] =
    createCtx<AuthContextInterface>();

export function AuthProvider({ children }: { children: JSX.Element }) {
    const [user, setUser] = useState<User | null>(null);

    const googleSignIn = () => {
        try {
            const provider = new GoogleAuthProvider();
            signInWithPopup(auth, provider);
        } catch (error) {
            console.log(error);
        }
    };

    const githubSignIn = () => {
        try {
            const provider = new GithubAuthProvider();
            signInWithPopup(auth, provider);
        } catch (error) {
            console.log(error);
        }
    };

    const logOut = () => signOut(auth);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) =>
            setUser(currentUser)
        );
        return () => unsubscribe();
    }, []);

    return (
        <AuthContextProvider
            value={{
                user,
                googleSignIn,
                githubSignIn,
                logOut,
            }}
        >
            {children}
        </AuthContextProvider>
    );
}
