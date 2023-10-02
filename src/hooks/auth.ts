import { useEffect } from "react";
import { shallowEqual } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/config/firebase";
import {
    setUser,
    signOutAsync,
    googleSignIn as googleSignInAsync,
    githubSignIn as githubSignInAsync,
} from "@/stores/auth";
import { useAppDispatch, useAppSelector } from "./stores";

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { user, isLoggedIn } = useAppSelector(
        (state) => ({
            user: state.auth.user,
            isLoggedIn: state.auth.isLoggedIn,
        }),
        shallowEqual
    );
    const googleSignIn = () => dispatch(googleSignInAsync());
    const githubSignIn = () => dispatch(githubSignInAsync());
    const signOut = () => dispatch(signOutAsync());
    const unsubscribe = onAuthStateChanged(auth, (currentUser) =>
        dispatch(setUser(currentUser))
    );

    useEffect(() => {
        return () => unsubscribe();
    }, []);

    return { user, isLoggedIn, googleSignIn, githubSignIn, signOut };
};
