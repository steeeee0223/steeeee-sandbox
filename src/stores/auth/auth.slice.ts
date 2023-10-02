import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    GithubAuthProvider,
    GoogleAuthProvider,
    User,
    signInWithPopup,
    signOut,
} from "firebase/auth";

import { auth } from "@/config/firebase";
import { AuthState } from "./auth";

export const initialState: AuthState = {
    user: null,
    isLoggedIn: false,
};

export const googleSignIn = createAsyncThunk("auth/googleSignIn", async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    return user;
});

export const githubSignIn = createAsyncThunk("auth/githubSignIn", async () => {
    const provider = new GithubAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    return user;
});

export const signOutAsync = createAsyncThunk("auth/signOutAsync", async () => {
    await signOut(auth);
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, { payload }: PayloadAction<User | null>) => {
            state.user = payload;
            state.isLoggedIn = payload !== null;
        },
    },
    extraReducers(builder) {
        builder.addCase(
            googleSignIn.fulfilled,
            (state, { payload }: PayloadAction<User>) => {
                state.isLoggedIn = true;
                state.user = payload;
            }
        );
        builder.addCase(
            githubSignIn.fulfilled,
            (state, { payload }: PayloadAction<User>) => {
                state.isLoggedIn = true;
                state.user = payload;
            }
        );
        builder.addCase(signOutAsync.fulfilled, (state) => {
            state.isLoggedIn = false;
            state.user = null;
        });
    },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
